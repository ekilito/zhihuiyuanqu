/* Layout */
import Layout from "@/layout";

// 动态路由表
export const asyncRoutes = [
    // 外层一级路由
    {
        path: "/park",
        component: Layout,
        permission: "park",
        meta: { title: "园区管理", icon: "el-icon-office-building" },
        // 内层二级路由
        children: [{
                path: "building",
                permission: "park:building",
                meta: { title: "楼宇管理" },
                component: () =>
                    import ("@/views/Park/Building/index"),
            },

            {
                path: "enterprise",
                permission: "park:enterprise",
                meta: { title: "企业管理" },
                component: () =>
                    import ("@/views/Park/Enterprise/index"),
            },
        ],
    },

    {
        path: "/parking",
        component: Layout,
        permission: "parking",
        meta: { title: "行车管理", icon: "el-icon-guide" },
        children: [{
                path: "area",
                permission: "parking:area",
                component: () =>
                    import ("@/views/Car/CarArea"),
                meta: { title: "园区区域管理" },
            },
            {
                path: "card",
                permission: "parking:card",
                component: () =>
                    import ("@/views/Car/CarCard"),
                meta: { title: "园区车辆管理" },
            },
            {
                path: "pay",
                permission: "parking:payment",
                component: () =>
                    import ("@/views/Car/CarPay"),
                meta: { title: "停车缴费管理" },
            },
        ],
    },
    {
        path: "/propety",
        component: Layout,
        permission: "property",
        children: [{
            path: "",
            component: () =>
                import ("@/views/Propety"),
            meta: { title: "物业费管理", icon: "el-icon-wallet" },
        }, ],
    },
    {
        path: "/pole",
        component: Layout,
        permission: "pole",
        meta: { title: "一体杆管理", icon: "el-icon-refrigerator" },
        children: [{
            path: "info",
            permission: "pole:info",
            component: () =>
                import ("@/views/Rod/RodManage"),
            meta: { title: "一体杆管理" },
        }, ],
    },
    {
        path: "/sys",
        component: Layout,
        permission: "sys",
        meta: { title: "系统管理", icon: "el-icon-setting" },
        children: [
            //{
            //         path: "role",
            //         permission: "sys:role",
            //         component: () =>
            //             import ("@/views/System/Role/index"),
            //         meta: { title: "角色管理" },
            //     },
            {
                path: "user",
                permission: "sys:user",
                component: () =>
                    import ("@/views/System/Employee/index"),
                meta: { title: "员工管理" },
            },
        ],
    },
];