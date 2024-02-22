import { ConnectionPositionPair, FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { POSITION_MAP } from './connection-postion-pair';
import { Subject, Subscription, merge } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { BaseTemplateOverLayComponent } from './base-template-overlay.component';

enum MenuState {
    closed = 0,
    opened = 1,
}

@Directive({
    selector: '[elTrigger]',
})
export class OverlayTriggerDirective implements OnInit, AfterViewInit, OnDestroy {
    @Input() elTrigger: BaseTemplateOverLayComponent;
    @Input() position: string = 'bottomLeft';
    @Input() triggerBy: 'click' | 'hover' | null = 'click';
    private portal: TemplatePortal;
    private positions: ConnectionPositionPair[] = [POSITION_MAP.bottomLeft, POSITION_MAP.right];
    private overlayRef: OverlayRef;
    private subscription = Subscription.EMPTY;
    private menuState = MenuState.closed;
    private readonly hover$ = new Subject<boolean>();
    private readonly click$ = new Subject<boolean>();

    constructor(private el: ElementRef, private overlay: Overlay, private vcr: ViewContainerRef) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.initialize();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        if (!this.elTrigger) {
            return;
        }
        this.click$.next(true);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter() {
        this.hover$.next(true);
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave() {
        this.hover$.next(false);
    }

    openMenu() {
        if (this.menuState === MenuState.opened) {
            return;
        }

        const overlayConfig = this.getOverlayConfig();
        this.setOverlayPosition(overlayConfig.positionStrategy as FlexibleConnectedPositionStrategy);
        const overlayRef = this.overlay.create(overlayConfig);

        overlayRef.attach(this.getPortal());
        this.subscribeOverlayEvent(overlayRef);
        this.overlayRef = overlayRef;
        this.menuState = MenuState.opened;
    }

    closeMenu() {
        if (this.menuState === MenuState.opened) {
            this.overlayRef?.detach();
            this.menuState = MenuState.closed;
        }
    }

    private initialize() {
        const menuVisible$ = this.elTrigger.visible$;
        const hover$ = merge(menuVisible$, this.hover$).pipe(debounceTime(100));

        const handle$ = this.triggerBy === 'hover' ? hover$ : this.click$;
        handle$.subscribe((value) => {
            if (value) {
                this.openMenu();
                return;
            }
            this.closeMenu();
        });
    }

    private getOverlayConfig(): OverlayConfig {
        const positionStrategy = this.overlay.position().flexibleConnectedTo(this.el);
        return new OverlayConfig({
            positionStrategy,
            minWidth: '200px',
            hasBackdrop: this.triggerBy !== 'hover',
            backdropClass: 'm-backdrop',
            panelClass: 'm-panel',
        });
    }

    private setOverlayPosition(positionStrategy: FlexibleConnectedPositionStrategy) {
        positionStrategy.withPositions([...this.positions]);
    }

    private getPortal(): TemplatePortal {
        if (!this.portal || this.portal.templateRef !== this.elTrigger.menuTemplate) {
            this.portal = new TemplatePortal<any>(this.elTrigger.menuTemplate, this.vcr);
        }
        return this.portal;
    }

    private subscribeOverlayEvent(overlayRef: OverlayRef) {
        this.subscription.unsubscribe();
        this.subscription = merge(overlayRef.backdropClick(), overlayRef.detachments()).subscribe(() => {
            this.closeMenu();
        });
    }
}
