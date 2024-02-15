using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using newPSG.PMS.MultiTenancy.HostDashboard.Dto;

namespace newPSG.PMS.MultiTenancy.HostDashboard
{
    public interface IIncomeStatisticsService
    {
        Task<List<IncomeStastistic>> GetIncomeStatisticsData(DateTime startDate, DateTime endDate,
            ChartDateInterval dateInterval);
    }
}