




class roleTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
 
        }
    }
  

    render() {
        
        var roleTrees = JSON.parse(window.localStorage.getItem('menuVOS'));

      
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
            >
             {
                roleTrees.map(function (item) {
                                 return (<SubMenu key={item.key}
                    title={<span><Icon type="appstore" /><span>{item.menuName}</span></span>}>
                    {item.childList.map((vl) => (
                        <Menu.Item key={vl.key} BreadArray={vl.menuParentName+","+vl.menuName}><Link to={vl.menuUrl}>{vl.menuName}</Link></Menu.Item>
                    ))}
                </SubMenu>)
                             }
                )
                
                }

               
            </Menu>
        )
    }
}



export default roleTree;