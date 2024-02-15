using Abp.Dependency;
using GraphQL;
using GraphQL.Types;
using newPSG.PMS.Queries.Container;

namespace newPSG.PMS.Schemas
{
    public class MainSchema : Schema, ITransientDependency
    {
        public MainSchema(IDependencyResolver resolver) :
            base(resolver)
        {
            Query = resolver.Resolve<QueryContainer>();
        }
    }
}