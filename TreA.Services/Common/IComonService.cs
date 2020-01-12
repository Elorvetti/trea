using System;
using System.Collections;
using System.Collections.Generic;
using TreA.Data;
using TreA.Data.Entities;

namespace TreA.Services.Common
{
    public partial interface ICommonService
    {
        string cleanStringPath(string name);
    }
}