using Xamarin.Forms.Internals;

namespace newPSG.PMS.Behaviors
{
    [Preserve(AllMembers = true)]
    public interface IAction
    {
        bool Execute(object sender, object parameter);
    }
}