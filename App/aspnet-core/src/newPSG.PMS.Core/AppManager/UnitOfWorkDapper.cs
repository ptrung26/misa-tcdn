using MicroOrm.Dapper.Repositories;
using MicroOrm.Dapper.Repositories.SqlGenerator;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;

namespace newPSG.PMS.AppManager
{
    public class UnitOfWorkDapper: IUnitOfWorkDapper
    {
        private readonly string _connectionString;
        private Dictionary<Type, object> _repositories;
        private IDbConnection _connection;
        private IDbTransaction _transaction;
        private bool _disposed;
        public UnitOfWorkDapper(string connectionString)
        {
            _connectionString = connectionString;
        }
        public IDbConnection Connection => _connection ??
                                           (_connection = new MySqlConnection(_connectionString));
        public IDbTransaction DbTransaction
        {
            get
            {
                if (Connection.State != ConnectionState.Open && Connection.State != ConnectionState.Connecting)
                {
                    Connection.Open();
                }
                return _transaction ?? (_transaction = Connection.BeginTransaction());
            }
            
        }
        public IDapperRepository<TEntity> DapperRepository<TEntity>() where TEntity : class, new()
        {
            if (_repositories == null) _repositories = new Dictionary<Type, object>();
            var type = typeof(TEntity);
            if (!_repositories.ContainsKey(type))
            {
                ISqlGenerator<TEntity> sqlGenerator = new SqlGenerator<TEntity>();
                _repositories[type] = new DapperRepository<TEntity>(this.Connection, sqlGenerator);
            }
            return (IDapperRepository<TEntity>)_repositories[type];
        }

        // dapper func
        public async Task<IEnumerable<dynamic>> QueryAsync(string query, object param = null, int? commandTimeout = null, CommandType? commandType = CommandType.Text)
        {
            return await Connection.QueryAsync(query, param, transaction: _transaction ?? null, commandTimeout: commandTimeout, commandType: commandType);
        }
        public async Task<IEnumerable<TK>> QueryAsync<TK>(string query, object param = null, int? commandTimeout = null, CommandType? commandType = CommandType.Text)
        {
            return await Connection.QueryAsync<TK>(query, param, transaction: _transaction ?? null, commandTimeout: commandTimeout, commandType: commandType);

        }
        public async Task<TK> QueryFirstAsync<TK>(string query, object param = null, int? commandTimeout = null, CommandType? commandType = CommandType.Text)
        {
            return await Connection.QueryFirstAsync<TK>(query, param, transaction: _transaction ?? null, commandTimeout: commandTimeout, commandType: commandType);
        }
        public async Task<TK> QuerySingleAsync<TK>(string query, object param = null, int? commandTimeout = null, CommandType? commandType = CommandType.Text)
        {
            return await Connection.QuerySingleAsync<TK>(query, param, transaction: _transaction ?? null, commandTimeout: commandTimeout, commandType: commandType);
        }
        public async Task<int> ExecuteAsync(string query, object param = null, bool buffered = true, int? commandTimeout = null, CommandType? commandType = CommandType.Text)
        {
            var affectedRows = await Connection.ExecuteAsync(query, param, transaction: _transaction ?? null, commandTimeout: commandTimeout, commandType: commandType);
            return affectedRows;
        }


        protected virtual void Dispose(bool disposing)
        {
            if (_disposed) return;
            if (_transaction != null)
            {
                _transaction?.Dispose();
                _transaction = null;
            }

            if (_connection != null)
            {
                _connection?.Close();
                _connection?.Dispose();
                _connection = null;
            }

            _disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
