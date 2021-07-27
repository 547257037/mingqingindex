import React from 'react';
import { Menu, Switch, Icon } from 'antd';

const { SubMenu } = Menu;

import {
    HashRouter as Router,
    Route,
    Link
} from 'react-router-dom';

class SideNav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: 'light',
            current: 'guest',
            defaultOpenKeys: ['sub1', 'sub2', 'sub4', 'sub5'],
            currentKey: ''
        }
    }
    changeTheme(value) {
        this.setState({
            theme: value ? 'dark' : 'light',
        });
    }
    handleClick(e) {
        const BreadArray = e.item.props.BreadArray
        this.props.handleBreadArray(BreadArray);
        this.setState({
            current: e.key,
        });
    }
    updateActive() {
        //页面刷新根据路由重新定位侧边栏的active
        var _path = window.location.href;
        var current = _path.substr(_path.lastIndexOf('/') + 1);
        var currentKey = this.getSubKey(current);

        this.setState({
            current: current,
            currentKey: currentKey
        })
    }
    componentDidMount() {
        this.updateActive();
    }
    getSubKey(current) {
        var currentKey;
        var keyMaps = {
            'sub1': ['Guest', 'Users', 'Articles'],
            'sub2': ['User', 'UserList'],
            'sub4': ['articleList', 'moduleList'],
            'sub5': ['MaterialList', 'itemList', 'InventoryVendorList'],


        }
        for (var key in keyMaps) {
            if (keyMaps[key].indexOf(current) != -1) {
                currentKey = key;
            }
        }
        return currentKey;
    }
    openChange(v) {
        this.setState({
            currentKey: v[v.length - 1]
        })
    }



    render() {
        
         var menuVOS  = JSON.parse(window.localStorage.getItem('menuVOS'));

      
        return (
            <Menu
                theme={this.state.theme}
                onClick={this.handleClick.bind(this)}
                style={{ height: '100%' }}
                openKeys={[this.state.currentKey]}
                selectedKeys={[this.state.current]}
                onOpenChange={this.openChange.bind(this)}
                mode="inline"
                multiple={true}
                inlineCollapsed={false}
            >
             {
                menuVOS.map(function (item) {
                                 return (<SubMenu key={item.key}
                    title={<span><Icon type="appstore" /><span>{item.menuName}</span></span>}>
                    {item.childList.map((vl) => (
                        <Menu.Item key={vl.key} BreadArray={vl.menuParentName+","+vl.menuName}><Link to={vl.menuUrl}>{vl.menuName}</Link></Menu.Item>
                    ))}
                </SubMenu>)
                             }
                )
                
                }
                 <Switch
                    checked={this.state.theme === 'dark'}
                    onChange={this.changeTheme.bind(this)}
                    checkedChildren="暗黑"
                    unCheckedChildren="亮白"
                />

        
               
            </Menu>
        )
    }
}

export default SideNav;