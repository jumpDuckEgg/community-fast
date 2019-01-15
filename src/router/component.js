const Layout = () => import('../views/layout/Layout');
const Login  = () => import('@/views/login/index');
const Page404 = () => import('@/views/404');
const Dashboard = () => import('@/views/dashboard/index');
const User = () => import('@/views/user/index');
const Menu = () => import('@/views/menu/index');
const Role = () => import('@/views/Role/index');
const FileConfig = () => import('@/views/file/index');
const Message = () => import('@/views/Message/index');
const Neighbourhood = () => import('@/views/neighbourhood/index');
const Ad = () => import('@/views/ad/index');
const AdPosition = () => import('@/views/adPosition/index');
const Board = () => import('@/views/board/index');
const Measurement = () => import('@/views/measurement/index');
const Log = () => import('@/views/log/index');
const Region = () => import('@/views/region/index');
const Category = () => import('@/views/category/index');
const Address = () => import('@/views/address/index');
const Shop = () => import('@/views/shop/index');
const Goods = () => import('@/views/goods/index');
const GoodsShop = () => import('@/views/goodsShop/index');
const Order = () => import('@/views/order/index');
const OrderDetail = () => import('@/views/orderDetail/index');
module.exports = {
    Layout,
    Login,
    Page404,
    Dashboard,
    User,
    Menu,
    Role,
    FileConfig,
    Message,
    Neighbourhood,
    Ad,
    AdPosition,
    Board,
    Measurement,
    Log,
    Region,
    Category,
    Address,
    Shop,
    Goods,
    GoodsShop,
    Order,
    OrderDetail
}