import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Input, Icon, Button, Popconfirm ,Pagination, Spin} from 'antd';
var axios = require('axios');
var moment = require('moment')
var Base = require('../../baseConst.js')

import style from  '../../style/UserList.scss';
import UserEdit from '../forms/UserEditForm'
import UserAdd from '../forms/UserAddForm'


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
      title: '用户名称',
      dataIndex: 'userName',
      width: '10%'
    }, {
      title: '用户性别',
      dataIndex: 'sexName',
      width: '10%'
    }, {
      title: '证件号码',
      dataIndex: 'idNumber',
      width: '10%'
    }, {
      title: '证件类型',
      dataIndex: 'idTypeName',
      width: '10%'
    }, {
      title: '出生日期',
      dataIndex: 'dateOfBirth',
      width: '10%'
    },
    {
      title: '联系电话',
      dataIndex: 'telephone',
      width: '10%'
    }
      ,
    {
      title: '手机短号',
      dataIndex: 'shortMobile',
      width: '10%'
    },
    {
      title: '所属厂商',
      dataIndex: 'vendorName',
      width: '10%'
    },
    {
      title: '用户职称',
      dataIndex: 'professionalName',
      width: '10%'
    }
      , 
      {
      title: '操作',
      width: '10%',
      render: (text, record, index) => {
        return (
          <div>
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.userId)}>
    
              <a href="javascript:;" style={{ marginRight: '10px' }}>删除</a>
            </Popconfirm>
            <a href="javascript:;" style={{ marginRight: '10px' }} onClick={() => this.onModify(record.userId, index)}>修改</a>
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
    axios.get(Base.userAPI + '/base-user/page', {
      params: {
        keyword: name || '',
        pageNo: pNo || 1,
        pageSize: 10
      }
    }).then(result => {
      if (result.status == 200) {
        var dataSource = [], count = 0;
        var d = result.data.data.list;
        var total = result.data.data.records;
        var pageNo = result.data.data.pageNo;
        if (d != null) {
          d.map(function (v, i) {
            var json = {};
            json.key = i;
            json.userId = v.userId;
            json.vendorId = v.vendorId;
            json.vendorName = v.vendorName;

            
            json.userName = v.userName;
            json.jobNo = v.jobNo;
            json.accountNo = v.accountNo;
            json.password = v.password;
            json.sex = v.sex;
            json.idTypeCode = v.idTypeCode;
            json.idTypeName= _this.getidTypeCode(v.idTypeCode);

            json.sexName = _this.getGenderText(v.sex);
            json.idNumber = v.idNumber;
            json.shortMobile = v.shortMobile;
       
            json.telephone = v.telephone;
        
            json.dateOfBirth = moment(v.dateOfBirth).format('YYYY-MM-DD');
            json.isDeleted = v.isDeleted;
            json.professionalName = v.professionalName;
            json.roleId = v.roleId;
            json.functions = v.functions;
            json.createdUserId = v.createdUserId;
            json.modifyiedUserId = v.modifyiedUserId;         
            json.modifyiedTime = moment(v.modifyiedTime).format('YYYY-MM-DD');
            json.createdTime = moment(v.createdTime).format('YYYY-MM-DD');
            dataSource.push(json)
          });
        }
        count = dataSource.length;
        _this.setState((prevState, props) => {
          return {
            dataSource: dataSource,
            count: count,
            total: total,
            current: pageNo,
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
    axios.delete(Base.userAPI + '/base-user/delete', {params:{ userId: id }})
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
  handleAdd () {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
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
          <Input size="large" placeholder="输入用户名称" onChange={this.handleChangeSearchInput.bind(this)} />
          <Button type="primary" icon="search" size='large' onClick={this.handleSearch.bind(this)} >搜索</Button>

        </div>
        <div className="example-input">
           <Button type="primary" size='large' onClick={this.add.bind(this)} >
            添加
          </Button>
        </div>
        <UserEdit
          showPop={this.state.showPop}
          infos={this.state.infos}
          getUser={this.getUser.bind(this)}
        />
          <UserAdd
         showPopAdd ={this.state.showPopAdd}
          getUser={this.getUser.bind(this)}
        />
       <Table bordered dataSource={dataSource} columns={columns} pagination={false} loading={this.state.isLoading} /><br />
        {this.state.total > 0 ?
          <Pagination current={this.state.current} onChange={this.onChange.bind(this)} total={this.state.total} />
          : null}
      </div>
    );
  }
}

export default UserList;