const Layout = () => import('../views/layout/Layout');
const Login  = () => import('@/views/login/index');
const Page404 = () => import('@/views/404');
const Dashboard = () => import('@/views/dashboard/index');
const Table = () => import('@/views/table/index');
const Tree = () => import('@/views/tree/index');
const User = () => import('@/views/user/index');
const Menu = () => import('@/views/menu/index');
const Role = () => import('@/views/Role/index');
const Form = () => import('@/views/form/index');
const FileConfig = () => import('@/views/file/index');
const Message = () => import('@/views/Message/index');

module.exports = {
    Layout,
    Login,
    Page404,
    Dashboard,
    Table,
    Tree,
    User,
    Menu,
    Role,
    Form,
    FileConfig,
    Message
}