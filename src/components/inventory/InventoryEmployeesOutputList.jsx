import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Input, Icon, Button, Popconfirm ,Pagination, Spin} from 'antd';
var axios = require('axios');
var moment = require('moment')
var Base = require('../../baseConst.js')

import style from  '../../style/UserList.scss';
import EmployeesOutputEdit from '../forms/EmployeesOutputEditForm'
import EmployeesOutputAdd from '../forms/EmployeesOutputAddForm'

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

class InventoryEmployeesOutputList extends React.Component {
  constructor(props) {
    var token = window.localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    super(props);
    this.columns = [{
      title: '产出员工',
      dataIndex: 'userName',
      width: '10%'
    }, {
      title: '产出厂商',
      dataIndex: 'vendorName',  //（0 加工厂 1 材料厂 3 其他）
      width: '10%'
    }, {
      title: '产出商品',
      dataIndex: 'itemName',
      width: '10%'
    }, {
      title: '产出数量',
      dataIndex: 'outputNumber',
      width: '10%'
    }, {
      title: '报废数量',
      dataIndex: 'scrapNumber',
      width: '10%'
    },
    {
        title: '使用材料',
        dataIndex: 'materialName',
        width: '10%'
      },
    {
      title: '使用设备设备',
      dataIndex: 'equipmentName',
      width: '10%'
    },
    {
      title: '产出开始时间',
      dataIndex: 'outputTimeStart',
      width: '10%'
    }
      ,
    {
      title: '产出结束时间',
      dataIndex: 'outputTimeEnd',
      width: '10%'
    },

    

      , {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record, index) => {
        return (
          <div>
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.employeesOutputId)}>
              <a href="javascript:;" style={{ marginRight: '10px' }}>删除</a>
            </Popconfirm>
            <a href="javascript:;" style={{ marginRight: '10px' }} onClick={() => this.onModify(record.employeesOutputId, index)}>修改</a>
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
    axios.get(Base.inventoryAPI + '/inventory-employees-output/page', {
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
            json.itemId = v.itemId;
            json.itemName = v.itemName;
                
            json.outputNumber = v.outputNumber;
            json.materialId = v.materialId;
            json.materialName = v.materialName;
            json.scrapNumber = v.scrapNumber;
            json.equipmentId = v.equipmentId; 
            json.equipmentName = v.equipmentName; 
            json.userId = v.userId
            json.userName = v.userName
            json.vendorId = v.vendorId;
            json.vendorName = v.vendorName;
            
            json.employeesOutputId = v.employeesOutputId;
            json.createdUserId = v.createdUserId;
            json.modifyiedUserId = v.modifyiedUserId;   
            
            json.modifyiedTime = moment(v.modifyiedTime).format('YYYY-MM-DD');
            json.createdTime = moment(v.createdTime).format('YYYY-MM-DD');
            json.outputTimeStart = moment(v.outputTimeStart).format('YYYY-MM-DD');
            json.outputTimeEnd = moment(v.outputTimeEnd).format('YYYY-MM-DD');
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
    axios.delete(Base.inventoryAPI + '/inventory-employees-output/delete', {params:{ employeesOutputId: id }})
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
        <EmployeesOutputEdit
          showPop={this.state.showPop}
          infos={this.state.infos}
          getUser={this.getUser.bind(this)}
        />
        <EmployeesOutputAdd
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

export default InventoryEmployeesOutputList;