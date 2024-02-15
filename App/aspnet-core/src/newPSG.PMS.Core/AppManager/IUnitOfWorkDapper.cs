using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using MicroOrm.Dapper.Repositories;

namespace newPSG.PMS.AppManager
{
    public interface IUnitOfWorkDapper : IDisposable
    {
        IDbTransaction DbTransaction { get; }
        IDbConnection Connection { get; }
        IDapperRepository<TEntity> DapperRepository<TEntity>() where TEntity : class, new();

        Task<IEnumerable<dynamic>> QueryAsync(string query, object param = null, int? commandTimeout = null,
            CommandType? commandType = CommandType.Text);

        Task<IEnumerable<TK>> QueryAsync<TK>(string query, object param = null, int? commandTimeout = null,
            CommandType? commandType = CommandType.Text);

        Task<TK> QueryFirstAsync<TK>(string query, object param = null, int? commandTimeout = null,
            CommandType? commandType = CommandType.Text);

        Task<TK> QuerySingleAsync<TK>(string query, object param = null, int? commandTimeout = null,
            CommandType? commandType = CommandType.Text);

        Task<int> ExecuteAsync(string query, object param = null, bool buffered = true, int? commandTimeout = null,
            CommandType? commandType = CommandType.Text);
    }
}
