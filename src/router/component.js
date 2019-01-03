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
const Category = () => import('@/views/region/index');
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
    Category
}