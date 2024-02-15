using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.BackgroundJobs;
using Abp.Webhooks;
using Abp.Webhooks.BackgroundWorker;
using newPSG.PMS.Authorization;
using newPSG.PMS.WebHooks.Dto;

namespace newPSG.PMS.WebHooks
{
    [AbpAuthorize(AppPermissions.Pages_Administration_Webhook_ListSendAttempts)]
    public class WebhookSendAttemptAppService : PMSAppServiceBase, IWebhookAttemptAppService
    {
        private readonly IWebhookSendAttemptStore _webhookSendAttemptStore;
        private readonly IBackgroundJobManager _backgroundJobManager;
        private readonly IWebhookEventAppService _webhookEventAppService;
        private readonly IWebhookSubscriptionAppService _webhookSubscriptionAppService;


        public WebhookSendAttemptAppService(
            IWebhookSendAttemptStore webhookSendAttemptStore,
            IBackgroundJobManager backgroundJobManager,
            IWebhookEventAppService webhookEventAppService,
            IWebhookSubscriptionAppService webhookSubscriptionAppService
            )
        {
            _webhookSendAttemptStore = webhookSendAttemptStore;
            _backgroundJobManager = backgroundJobManager;
            _webhookEventAppService = webhookEventAppService;
            _webhookSubscriptionAppService = webhookSubscriptionAppService;
        }

        public async Task<PagedResultDto<GetAllSendAttemptsOutput>> GetAllSendAttempts(GetAllSendAttemptsInput input)
        {
            if (string.IsNullOrEmpty(input.SubscriptionId))
            {
                throw new ArgumentNullException(nameof(input.SubscriptionId));
            }

            var list = await _webhookSendAttemptStore.GetAllSendAttemptsBySubscriptionAsPagedListAsync(
                AbpSession.TenantId,
                Guid.Parse(input.SubscriptionId), 
                input.MaxResultCount, 
                input.SkipCount
            );

            return new PagedResultDto<GetAllSendAttemptsOutput>(list.TotalCount, ObjectMapper.Map<List<GetAllSendAttemptsOutput>>(list.Items));
        }

        public async Task<ListResultDto<GetAllSendAttemptsOfWebhookEventOutput>> GetAllSendAttemptsOfWebhookEvent(GetAllSendAttemptsOfWebhookEventInput input)
        {
            if (string.IsNullOrEmpty(input.Id))
            {
                throw new ArgumentNullException(nameof(input.Id));
            }

            var list = await _webhookSendAttemptStore.GetAllSendAttemptsByWebhookEventIdAsync(
                AbpSession.TenantId,
                Guid.Parse(input.Id)
            );

            var mappedList = ObjectMapper.Map<List<GetAllSendAttemptsOfWebhookEventOutput>>(list);

            return new ListResultDto<GetAllSendAttemptsOfWebhookEventOutput>(mappedList);
        }

        [AbpAuthorize(AppPermissions.Pages_Administration_Webhook_ResendWebhook)]
        public async Task Resend(string sendAttemptId)
        {
            var webhookSendAttempt = await _webhookSendAttemptStore.GetAsync(AbpSession.TenantId, Guid.Parse(sendAttemptId));
            var webhookEvent = await _webhookEventAppService.Get(webhookSendAttempt.WebhookEventId.ToString());
            var webhookSubscription = await _webhookSubscriptionAppService.GetSubscription(webhookSendAttempt.WebhookSubscriptionId.ToString());

            _backgroundJobManager.Enqueue<WebhookSenderJob, WebhookSenderArgs>(new WebhookSenderArgs()
            {
                TenantId = AbpSession.TenantId,
                WebhookEventId = webhookSendAttempt.WebhookEventId,
                WebhookSubscriptionId = webhookSendAttempt.WebhookSubscriptionId,
                Data = webhookEvent.Data,
                WebhookName = webhookEvent.WebhookName,
                WebhookUri = webhookSubscription.WebhookUri,
                Headers = webhookSubscription.Headers,
                Secret = webhookSubscription.Secret,
                TryOnce = true
            });
        }
    }
}
