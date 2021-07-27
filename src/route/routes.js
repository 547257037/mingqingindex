import Home from '../components/Home.jsx';



import UserList from '../components/userManage/UserList.jsx';

import ArticleList from '../components/articleManage/ArticleList.jsx';
import ModuleList from '../components/articleManage/ModuleList.jsx';

import EditArticle from '../components/articleManage/EditArticle.jsx';

import ItemList from '../components/inventory/ItemList.jsx';
import MaterialList from '../components/inventory/MaterialList.jsx';
import InventoryVendorList from '../components/inventory/InventoryVendorList.jsx';
import MenuList from '../components/userManage/menuList.jsx';

import RoleList from '../components/userManage/RoleList.jsx';
import Equipment from '../components/inventory/EquipmentList.jsx';
import Order from '../components/inventory/InventoryOrderList.jsx';
import EmployeesOutput from '../components/inventory/InventoryEmployeesOutputList.jsx';
import FinancialWage from '../components/financial/FinancialWageList.jsx';

import ScrapIron from '../components/financial/FinancialScrapIronList.jsx';
import Rent from '../components/financial/FinancialRentList.jsx';

import Electricity from '../components/financial/FinancialElectricityList.jsx';
import Liabilities from '../components/financial/FinancialMaintainList.jsx';
import Maintain from '../components/financial/FinancialLiabilitiesList.jsx';


import ItemTotal from '../components/panel/ItemTotal.jsx';

import OrderTotal from '../components/panel/OrderTotal.jsx';

import Profits from '../components/panel/Profits.jsx';

import SpendingList from '../components/panel/SpendingList.jsx';

import SpendingTotal from '../components/panel/SpendingTotal.jsx';


// var menuVOS = JSON.parse(window.localStorage.getItem('menuVOS'));
// const routes = [];
// var home = {
//     path: '/',
//     exact: true,
//     content: Home
// }
// routes.push(home)
// var i=0,len=menuVOS.length;
// for (; i<len; )
// { 
//    var routesObject = {
//         path: menuVOS[i].menuUrl,
//         content: menuVOS[i].menuKey
//     }
//     routes.push(routesObject)
//    var childList =  menuVOS[i].childList;
//     var i2=0,len2=childList.length;
//     for (; i2<len2; )
//     { 
//        var routesObject2 = {
//             path: childList[i2].menuUrl,
//             content: childList[i2].menuKey
//         }
//         console.log(2,childList);

//         routes.push(routesObject2)
//         i2++;
//     }

//     i++;
// }

// console.log(11,routes);



const routes = [



    {
        path: '/',
        exact: true,
        content: Home
    },
    {
        path: '/app/panel/OrderTotal/',
        content: OrderTotal
    },
    {
        path: '/app/panel/SpendingList/',
        content: SpendingList
    },
    {
        path: '/app/panel/SpendingTotal/',
        content: SpendingTotal
    },
    {
        path: '/app/panel/ItemTotal',
        content: ItemTotal
    },
    {
        path: '/app/panel/Profits',
        content: Profits
    },
    {
        path: '/app/userManage/userList',
        content: UserList
    },
    {
        path: '/app/articleManage/articleList',
        content: ArticleList
    },
    {
        path: '/app/articleManage/moduleList',
        content: ModuleList
    },
    {
        path: '/app/edit/:id',
        content: EditArticle
    },
    {
        path: '/app/inventory/materialList',
        content: MaterialList
    },
    {
        path: '/app/inventory/itemList',
        content: ItemList
    },
    {
        path: '/app/inventory/inventoryVendorList',
        content: InventoryVendorList
    },
    {
        path: '/app/userManage/roleList',
        content: RoleList
    },
    {
        path: '/app/userManage/menuList',
        content: MenuList
    },

    {
        path: '/app/inventory/equipmentList',
        content: Equipment
    },
    {
        path: '/app/inventory/inventoryOrderList',
        content: Order
    },
    {
        path: '/app/inventory/inventoryEmployeesOutputList',
        content: EmployeesOutput
    },

    {
        path: '/app/financial/financialWageList',
        content: FinancialWage
    },

    {
        path: '/app/financial/financialScrapIronList',
        content: ScrapIron
    },

    {
        path: '/app/financial/financialRentList',
        content: Rent
    }
    ,

    {
        path: '/app/financial/financialElectricityList',
        content: Electricity
    }
    ,

    {
        path: '/app/financial/financialLiabilitiesList',
        content: Liabilities
    }
    ,

    {
        path: '/app/financial/financialMaintainList',
        content: Maintain
    }
    
];

export default routes;