import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Input, Icon, Button, Popconfirm ,Pagination, Spin} from 'antd';
var axios = require('axios');
var moment = require('moment')
var Base = require('../../baseConst.js')

import MenuEdit from '../forms/MenuEditForm'
import MenuAdd from '../forms/MenuAddForm'

class EditableCell extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: this.props.value,
      editable: false,
    }
  }
  handleChange (e) {
    const value = e.target.value;
    this.setState({ value });
  }
  check (){
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit (){
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange.bind(this)}
                onPressEnter={this.check.bind(this)}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check.bind(this)}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit.bind(this)}
              />
            </div>
        }
      </div>
    );
  }
}

class UserList extends React.Component {
  constructor(props) {
    var token = window.localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    super(props);
    this.columns = [{
      title: '菜单名称',
      dataIndex: 'menuName',
      width: '10%'
    }, {
      title: '排序号',
      dataIndex: 'sortNo',
      width: '10%'
    }, {
      title: '菜单URL',
      dataIndex: 'menuUrl',
      width: '10%'
    }, {
      title: '父级',
      dataIndex: 'menuParentName',
      width: '10%'
    },
    {
      title: '图片URL',
      dataIndex: 'imageUrl',
      width: '10%'
    },
    {
      title: '说明',
      dataIndex: 'remark',
      width: '10%'
    }, {
      title: 'menuKey',
      dataIndex: 'menuKey',
      width: '10%'
    },

      , 
      {
      title: '操作',
      width: '10%',
      render: (text, record, index) => {
        return (
          <div>
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.menuId)}>
    
              <a href="javascript:;" style={{ marginRight: '10px' }}>删除</a>
            </Popconfirm>
            <a href="javascript:;" style={{ marginRight: '10px' }} onClick={() => this.onModify(record.menuId, index)}>修改</a>
          </div>
        );
      },
    }];


    this.state = {
      dataSource:[],
      count: 2,
      current: 1,
      total: 0,
      showPop: false,
      isLoading: false,
      showPopAdd : false
    };
  }
  componentDidMount() {
    this.getUser();
  }
  getidTypeCode (idTypeCode) {
    var idTypeCodeText;
    switch (idTypeCode) {
      case 0:
        idTypeCodeText = '身份证';
        break;
      case 1:
        idTypeCodeText = '护照';
        break;
      case 2:
        idTypeCodeText = '户口本';
        break;
      default:
        idTypeCodeText = '其他';  
        break;
    }
    return idTypeCodeText;
  }

  getGenderText (gender) {
    var genderText;
    switch (gender) {
      case 0:
        genderText = '男';
        break;
      case 1:
        genderText = '女';
        break;
      case 2:
        genderText = '保密';
        break;
      default:
        genderText = '男';  
        break;
    }
    return genderText;
  }
  getUser(name, pNo) {
    var _this = this;
    axios.get(Base.userAPI + '/base-menu/page', {
      params: {
        keyword: name || '',
        pageNo: pNo || 1,
        pageSize: 10
      }
    }).then(result => {
      if (result.status == 200) {
        var dataSource = [];
        var d = result.data.data.list;
        var total = result.data.data.records;
        var pageNo = result.data.data.pageNo;

        if (d != null) {
          d.map(function (v, i) {
            var json = {};
            json.key = i;
            json.menuId = v.menuId;
            json.isLeaf = v.isLeaf;
            json.menuName = v.menuName;
            json.sortNo = v.sortNo;
            json.menuUrl = v.menuUrl;
            json.menuParentId = v.menuParentId;
            json.menuParentName=v.menuParentName
            json.imageUrl = v.imageUrl;
            json.remark = v.remark;
            json.isStoped = v.isStoped;
            json.menuKey = v.menuKey;

            
            json.createdUserId = v.createdUserId;
            json.modifyiedUserId = v.modifyiedUserId;         
            json.modifyiedTime = moment(v.modifyiedTime).format('YYYY-MM-DD');
            json.createdTime = moment(v.createdTime).format('YYYY-MM-DD');
            dataSource.push(json)
           
          });
        }
        _this.setState((prevState, props) => {
          return {
            dataSource: dataSource,
            current: pageNo,
            total: total,
            showPop: false,
            isLoading: false,
            showPopAdd : false
          };
        });

      } else {
        alert('错误');
        _this.setState({
          isLoading: false
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }
  onCellChange (index, key) {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  }

  onDelete(id) {
    axios.delete(Base.userAPI + '/base-menu/delete', {params:{ menuId: id }})
      .then(result => {
        if (result.status === 200 && result.data.code === 200) {
          var name = this.state.searchVal;
          this.getUser(name);
        }
        if(result.data.type!=='success'){
          message.error(result.data.message)
      }
      })
      .catch(err => {
        console.log(err)
      })
  }
  onModify (id,index) {
    this.setState({
      showPop: true,
      showPopAdd : false,
      infos: [...this.state.dataSource][index]
    })
  }
  add () {
    this.setState({
      showPopAdd: true,
      showPop: false
    })
  }
  onForbidden (id) {
  }


  onChange(page){
    var name = this.state.searchVal;
    this.setState({
      current: page,
      isLoading: true
    });
    this.getUser(name,page)
  }
  handleChangeSearchInput(e) {
    var searchVal = e.target.value;
    this.setState({
      searchVal: searchVal
    })
  }
  handleSearch() {
    var name = this.state.searchVal;
    this.setState({
      isLoading: true,
      current: 1,
      showPopAdd: false,
    })
    this.getUser(name, 1);

  }
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>
 
        <div className="example-input">
          <Input size="large" placeholder="输入菜单名称" onChange={this.handleChangeSearchInput.bind(this)} />
          <Button type="primary" icon="search" size='large' onClick={this.handleSearch.bind(this)} >搜索</Button>

        </div>
        <div className="example-input">
           <Button type="primary" size='large' onClick={this.add.bind(this)} >
            添加
          </Button>
        </div>
        <MenuEdit
          showPop={this.state.showPop}
          infos={this.state.infos}
          getUser={this.getUser.bind(this)}
        />
          <MenuAdd
         showPopAdd ={this.state.showPopAdd}
          getUser={this.getUser.bind(this)}
        />
       <Table bordered dataSource={dataSource} columns={columns} pagination={false} loading={this.state.isLoading} /><br />
        {this.state.total > 0 ?
          <Pagination current={this.state.current} onChange={this.onChange.bind(this)}  total={this.state.total} /> 
          : null}
      </div>
    );
  }
}

export default UserList;