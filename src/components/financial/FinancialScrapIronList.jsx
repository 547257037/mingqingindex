import React from 'react';
import ReactDOM from 'react-dom';
import { Table, Input, Icon, Button, Popconfirm ,Pagination, Spin} from 'antd';
var axios = require('axios');
var moment = require('moment')
var Base = require('../../baseConst.js')

import style from  '../../style/UserList.scss';
import FinancialScrapIronEdit from '../forms/FinancialScrapIronEditForm'
import FinancialScrapIronAdd from '../forms/FinancialScrapIronAddForm'


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

class FinancialScrapIronList extends React.Component {
  constructor(props) {
    var token = window.localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = token;
    super(props);
    this.columns = [{
      title: '厂商名称',
      dataIndex: 'vendorName',
      width: '7%'
    }, {
      title: '铁屑卖出时间',
      dataIndex: 'sellTime',  
      width: '7%'
    }, {
      title: '铁屑每斤金额',
      dataIndex: 'price',
      width: '7%'
    }, {
      title: '卖出总斤数',
      dataIndex: 'totalNumber',
      width: '7%'
    }, {
      title: '总收入',
      dataIndex: 'totalAmount',
      width: '7%'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '7%'
    }
      , {
      title: '操作',
      dataIndex: 'operation',
      width: '7%',
      render: (text, record, index) => {
        return (
          <div>
            
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.scrapIronId )}>
              <a href="javascript:;" style={{ marginRight: '10px' }}>删除</a>
            </Popconfirm>
            <a href="javascript:;" style={{ marginRight: '10px' }} onClick={() => this.onModify(record.scrapIronId , index)}>修改</a>

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
  getWageType(wageType) {
    var wageTypeText;
    switch (wageType) {
      case 0:
        wageTypeText = '计件';
        break;
      case 1:
        wageTypeText = '底薪';
        break;
      case 2:
        wageTypeText = '其他';
          break;
      case 3:
        wageTypeText = '已撤销';
        break;

    }
    return wageTypeText;
  }
  getUser(name, pNo) {
    var _this = this;
    axios.get(Base.financialAPI + '/financial-scrap-iron/page', {
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
                      json.key = i;
                        json.sellTime = moment(v.sellTime).format('YYYY-MM-DD');
                        json.price = v.price;
                        json.totalNumber = v.totalNumber;
                        json.totalAmount = v.totalAmount;
                        json.remark = v.remark;
                        json.vendorName = v.vendorName; 
                        json.scrapIronId = v.scrapIronId; 
                        json.vendorId = v.vendorId;
                        json.isDeleted = v.isDeleted;
                        json.createdUserId = v.createdUserId;   
                   json.modifyiedUserId = v.modifyiedUserId;         
                    json.modifyiedTime = moment(v.modifyiedTime).format('YYYY-MM-DD');
                  json.createdTime = moment(v.createdTime).format('YYYY-MM-DD');
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
    axios.delete(Base.financialAPI + '/financial-scrap-iron/delete', {params:{ financialScrapIronId: id }})
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
          <Input size="large" placeholder="输入订单号" onChange={this.handleChangeSearchInput.bind(this)} />
          <Button type="primary" icon="search" size='large' onClick={this.handleSearch.bind(this)} >搜索</Button>
        </div>
        <div className="example-input">
           <Button type="primary" size='large' onClick={this.add.bind(this)} >
            添加
          </Button>
        </div>
        <FinancialScrapIronEdit 
          showPop={this.state.showPop}
          infos={this.state.infos}
          getUser={this.getUser.bind(this)}
        />
        <FinancialScrapIronAdd
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

export default FinancialScrapIronList;