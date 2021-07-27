import React from 'react';
import { Layout, Menu, Icon,Button  } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Header, Content, Sider } = Layout;
import { Link } from 'react-router-dom';

const logoStyle = {
    width: '120px',
    height: '31px',
    background: '#333',
    borderRadius: '6px',
    margin: '16px 28px 16px 0',
    float:'left',
    textAlign:'center',
    lineHeight:'31px',
    color: '#fff',
    fontWeight:'bolder'
}

class Head extends React.Component {
    constructor (props) {
        super (props);
        this.state = {

        }
    }
    shouye () {
   window.location.href = window+'/app/panel/guest';
    }
    handleClick ({item,key,keyPath}) {
        window.localStorage.removeItem('token');
        window.location.href = window.location.origin;
    }
    render () {
       var userName = window.localStorage.getItem('userName');

        return (
            <Header className="header">

                <Link to="/app/panel/OrderTotal" style={{color:'black'}}>
                <Button className='logo' style = {logoStyle} >数据总览</Button>

            </Link>
            {/* <Link to="/app/panel/Profits" style={{color:'black'}}>
                <Button className='logo' style = {logoStyle} >总利润</Button>

            </Link>
            <Link to="/app/panel/ItemTotal" style={{color:'black'}}>
                <Button className='logo' style = {logoStyle} >总产值</Button>

            </Link>
        
            <Link to="/app/panel/SpendingTotal" style={{color:'black'}}>
                <Button className='logo' style = {logoStyle} >总支出</Button>

            </Link>
            <Link to="/app/panel/SpendingList" style={{color:'black'}}>
                <Button className='logo' style = {logoStyle} >支出详情</Button>

            </Link> */}
            
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{ lineHeight: '64px',float:'right' }}
                    onClick = {this.handleClick.bind(this)}
                >
                    <SubMenu title={<span><Icon type='user' />{userName}</span>}
                    >
                        <MenuItemGroup>
                            <Menu.Item key = 'logout'>
                                退出
                            </Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                </Menu>
            </Header>
        )
    }
}

export default Head;
