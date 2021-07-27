import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Input, Icon, Button, Popconfirm ,Pagination, Spin} from 'antd';
var axios = require('axios');
var moment = require('moment')
var Base = require('../../baseConst.js')

import style from  '../../style/UserList.scss';
import VendorEdit from '../forms/VendorEditForm'
import VendorAdd from '../forms/VendorAddForm'

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

class MaterialList extends React.Component {
  constructor(props) {
    var token = window.localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    super(props);
    this.columns = [{
      title: '厂商名称',
      dataIndex: 'vendorName',
      width: '10%'
    }, {
      title: '厂商类型',
      dataIndex: 'vendorTypeName',  //（0 加工厂 1 材料厂 3 其他）
      width: '10%'
    }, {
      title: '厂商电话',
      dataIndex: 'vendorPhone',
      width: '10%'
    }, {
      title: '厂商地址',
      dataIndex: 'vendorAddress',
      width: '10%'
    }, {
      title: '厂商图片',
      dataIndex: 'vendorUrl',
      width: '10%'
    },
    {
      title: '法人姓名',
      dataIndex: 'legalPersonName',
      width: '10%'
    },
    {
      title: '法人电话',
      dataIndex: 'legalPersonPhone',
      width: '10%'
    }
      ,
    {
      title: '法人身份证',
      dataIndex: 'legalPersonIdCard',
      width: '10%'
    },

    {
      title: '证书地址',
      dataIndex: 'certificateAddress',
      width: '10%'
    }
    

      , {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record, index) => {
        return (
          <div>
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.vendorId)}>
              <a href="javascript:;" style={{ marginRight: '10px' }}>删除</a>
            </Popconfirm>
            <a href="javascript:;" style={{ marginRight: '10px' }} onClick={() => this.onModify(record.vendorId, index)}>修改</a>
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
  getvendorTypeText (vendorType) {
    var vendorTypeText;
    switch (vendorType) {
      case '0':
        vendorTypeText = '加工厂';
        break;
      case '1':
        vendorTypeText = '材料厂';
        break;
      case '2':
        vendorTypeText = '商家';
          break;
      case '3':
        vendorTypeText = '其他';
        break;

    }
    return vendorTypeText;
  }
  getUser(name, pNo) {
    var _this = this;
    axios.get(Base.userAPI + '/inventory-vendor/page', {
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
            json.vendorId = v.vendorId;
            json.vendorUrl = v.vendorUrl;
            json.vendorName = v.vendorName;
            json.vendorPhone = v.vendorPhone;
            json.vendorType = v.vendorType; 
            json.vendorTypeName = _this.getvendorTypeText(v.vendorType); 
            json.vendorAddress = v.vendorAddress;
            json.legalPersonName = v.legalPersonName;
            json.legalPersonPhone = v.legalPersonPhone;
            json.legalPersonIdCard = v.legalPersonIdCard;
            json.certificateAddress = v.certificateAddress;
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
            current: pageNo,
            total: total,
            showPop: false,
            isLoading: false,
            showPopAdd: false
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
    axios.delete(Base.userAPI + '/inventory-vendor/delete', {params:{ vendorId: id }})
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
      showPopAdd: false,
      infos: [...this.state.dataSource][index]
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
      showPopAdd: false,
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
  add () {
    this.setState({
      showPopAdd: true,
      showPop: false
    })
  }
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>
        <div className="example-input">
          <Input size="large" placeholder="输入厂商名称" onChange={this.handleChangeSearchInput.bind(this)} />
          <Button type="primary" icon="search" size='large' onClick={this.handleSearch.bind(this)} >搜索</Button>
        </div>
        <div className="example-input">
           <Button type="primary" size='large' onClick={this.add.bind(this)} >
            添加
          </Button>
        </div>
        <VendorEdit
          showPop={this.state.showPop}
          infos={this.state.infos}
          getUser={this.getUser.bind(this)}
        />
        <VendorAdd
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

export default MaterialList;