import React from 'react';
import ReactDOM from 'react-dom';

import css from '../forms/EditableTable.css';


import { Table ,Button,Icon , Modal, Form, Input, Popconfirm, Select, DatePicker,InputNumber,message  } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';

var axios = require('axios');
moment.locale('zh-cn');
var Base = require('../../baseConst.js');
var token = window.localStorage.getItem('token');
var vendorAll=[];
var itemAll=[];

var UpdateinventoryOrderDetailVOS= [];
axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const OrderEditForm = Form.create()(
    (props) => {
  
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title='修改订单信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
                width='800'
            >
                <Form layout='vertical'>
                    {/* <FormItem label='生产厂商'>
                        {getFieldDecorator('submitVendorId', {
                            rules: [{ required: true, message: '请填写生产厂商' }],
                            initialValue: props.infos.submitVendorId
                        })(
                            <Select disabled={true} defaultValue={props.infos.submitVendorId} style={{ width: 120 }}  >

                            {vendorAll.map(city => (

                                <Option value={city.vendorId}>{city.vendorName}</Option>

                            )
                            )}

                        </Select>
                        )}
                    </FormItem>
             */}
                    <FormItem label='收货厂商'>
                        {getFieldDecorator('receiveVendorId', {
                            rules: [{ required: true, message: '请填写收货厂商' }],
                            initialValue: props.infos.receiveVendorId
                        })(
                            <Select defaultValue={props.infos.receiveVendorId} style={{ width: 120 }}  >

                            {vendorAll.map(city => (

                                <Option value={city.vendorId}>{city.vendorName}</Option>

                            )
                            )}

                        </Select>
                        )}
                    </FormItem>

                 
{/*             
                    <FormItem label='订单总价'>
                        {getFieldDecorator('orderTotalPrice', {
                            rules: [{ required: true, message: '请填写材料单价' }],
                            initialValue: props.infos.orderTotalPrice
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='订单成本总价'>
                        {getFieldDecorator('orderCost', {
                            rules: [{ required: true, message: '请填写原材料' }],
                            initialValue: props.infos.orderCost
                        })(
                            <Input disabled={true}  />
                        )}
                    </FormItem>
                    <FormItem label='订单利润'>
                        {getFieldDecorator('orderProfits', {
                            rules: [{ required: true, message: '请填写商品库存' }],
                            initialValue: props.infos.orderProfits
                        })(
                            <Input disabled={true}  />
                        )}
                    </FormItem> */}
                    <FormItem label='预交定金'>
                        {getFieldDecorator('deposit', {
                            rules: [{ required: true, message: '请填写材料图片' }],
                            initialValue: props.infos.deposit
                        })(
                          <InputNumber
                          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                       
                        />
                        )}
                    </FormItem>

                    <FormItem label='约定付款时间'>
                        {getFieldDecorator('contractPaymentTime', {
                            rules: [{ required: true, message: '请填写约定付款时间' }],
                            initialValue: moment(props.infos.contractPaymentTime)
                        })(
                            <DatePicker  format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    
                    <FormItem label='交货时间'>
                        {getFieldDecorator('submitDate', {
                            rules: [{ required: true, message: '请填写商品保质期' }],
                            initialValue: moment(props.infos.submitDate)
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>

                    
                    <FormItem label='订单状态'>
                        {getFieldDecorator('orderState', {
                          rules: [{ required: true, message: '生产厂商' }],
                          initialValue: props.infos.orderState.toString()

                        })(
                            <Select defaultValue={props.infos.orderState} style={{ width: 120 }}  >
                                     
                            
                        
                                <Option key='0'>创建</Option>
                                <Option key='1'>未支付</Option>
                                <Option key='2'>已支付</Option>
                                <Option key='3'>已销毁</Option>

                          
                          </Select>
                        )}
                    </FormItem>
                    <FormItem label='订单备注'>
                        {getFieldDecorator('remark', {
                            initialValue: props.infos.remark
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem label='订单详情'>
                        {getFieldDecorator('inventoryOrderDetailVOS', {
                        })(
                          
                            <EditableTable  orderDetail={props.infos.inventoryOrderDetailVOS}/>

                        )}
                    </FormItem>



                </Form>
            </Modal>
        )
    }
);

class OrderEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            infos: {
                deposit:'',
                orderId: '',
                submitVendorId: '',
                receiveVendorId: '',
                submitVendorName: '',
                contractPaymentTime:'',
                receiveVendorName: '',
                orderTotalPrice: '',
                orderCost: '',
                orderProfits:'',
                submitDate: '',
                orderState: '',
                createdUserId:'',
                createdTime:'',
                modifyiedUserId:'',
                modifyiedTime:'',
                remark:'',
                inventoryOrderDetailVOS:[]
            }
        }
    }
    componentWillMount(){
      this.selectChange(); 
      this.selectChange2(); 
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.infos) {
            return;
        }
      

        this.setState({
            visible: nextProps.showPop,
            infos: nextProps.infos
        });


    }
    showModal() {
        this.setState({
            visible: true
        })
    }

    handleCancel() {
        this.setState({
            visible: false
        })
    }
    selectChange(){
        axios.get(Base.userAPI + '/inventory-vendor/getAll')
        .then(result => {
            if (result.status === 200 && result.data.code === 200) {
                vendorAll=result.data.data
           
            }
            if(result.data.type!=='success'){
                message.error(result.data.message)
            }
        }) 
         .catch(err => {
            console.log(err)
        })
    }

    selectChange2(){
      axios.get(Base.inventoryAPI + '/inventory-item/getAll')
      .then(result => {
          if (result.status === 200 && result.data.code === 200) {
              itemAll=result.data.data
         
          }
          if(result.data.type!=='success'){
              message.error(result.data.message)
          }
      }) 
       .catch(err => {
          console.log(err)
      })
  }


    handleCreate() {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var json = {};
            json = values;
            json.orderId = this.state.infos.orderId;

            json.inventoryOrderDetailVOS= UpdateinventoryOrderDetailVOS
            axios.put(Base.inventoryAPI + '/inventory-order/update', json)
                .then(result => {
                    if (result.status === 200 && result.data.code === 200) {
                        this.props.getUser();
                        location.reload();
                    }
                    if(result.data.type!=='success'){
                        message.error(result.data.message)
                        
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            form.resetFields();
            this.setState({ visible: false })
        })
    }
    saveFormRef(form) {
        this.form = form;
    }
    render() {
        return (
            <div>
                <OrderEditForm
                    ref={this.saveFormRef.bind(this)}
                    visible={this.state.visible}
                    infos={this.state.infos}
                    onCancel={this.handleCancel.bind(this)}
                    onCreate={this.handleCreate.bind(this)}
                  
                />
            </div>
        );
    }onCreate
}
class EditableCell2 extends React.Component {
    constructor(props) {
      super(props);
     this.state = {
      value: this.props.value,
      editable: false,
    }
  }
    handleChange(e) {
      const value = e.target.value;
      this.setState({ value });
    }
    check () {
      this.setState({ editable: false });
      if (this.props.onChange) {
        this.props.onChange(this.state.value);
      }
    }
    edit ()  {
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
  

  var count = 0;  
  class EditableTable extends React.Component {

    constructor(props) {
      super(props);
      this.columns = [{
          width: '20%', 
        title: '商品名称',
        dataIndex: 'itemName',
        render: (text, record) => (
        
        <Select onChange={this.onCellChange(record.count, 'itemId')} defaultValue={text} style={{ width: 120 }}  >
        

          {itemAll.map(city => (
                
              <Option value={city.itemId}>{city.itemName}</Option>

          )
          )}

      </Select>
        )
     
      }, {
          width: '15%', 
  
        title: '商品数量',
        dataIndex: 'itemNumber',
        render: (itemId, record) => (
          <EditableCell2
            value={itemId}
            onChange={this.onCellChange(record.count, 'itemNumber')}
          />
        )
      }, {
          width: '15%', 
  
        title: '商品总价',
        dataIndex: 'itemTotalPrice',
      }, 
      {
        width: '15%', 

      title: '商品成本',
      dataIndex: 'itemCost',
    }, 
      {
          width: '15%', 
  
          title: '商品利润',
          dataIndex: 'itemProfits',
        },
        {
          width: '15%', 
  
          title: '所用材料名称',
          dataIndex: 'materialName',
        }
        
      ,{
        width: '15%',   
        title: '操作',
        dataIndex: 'itemId',
        render: (itemId, record) => {
          return (
           
            (
              <Popconfirm title="删除详情订单会改变，确定吗?" onConfirm={() => this.onDelete(record)}>
                <a href="#">删除详情</a>
              </Popconfirm>
            )
          );
        },
      }];

     var  orderId ;
      for(var item in props.orderDetail){  
        props.orderDetail[item].count =count;
        orderId =props.orderDetail[item].orderId;
        count = count+1;
     }  
      this.state = {
        dataSource : props.orderDetail,
        count:count,
        orderId : orderId
      }
 

    }

    shouldComponentUpdate(nextProps,nextState){
      UpdateinventoryOrderDetailVOS =nextState.dataSource;
      return true;
    }
    onCellChange  (count, dataIndex) {
      return (value) => {

        const dataSource = [...this.state.dataSource];
        const target = dataSource.find(item => item.count == count);
        if (target) {
         
          target[dataIndex] = value;
          this.setState({ dataSource });
        }
      };
    }
  
    onDelete (key)  {
       if(key.orderDetailId !=null){
      axios.delete(Base.inventoryAPI + '/inventory-order-detail/delete', {params:{ orderDetailId: key.orderDetailId }})
      .then(result => {
        if (result.status === 200 && result.data.code === 200) {
 
        }
        if(result.data.type!=='success'){
          message.error(result.data.message)
      }
      })
      .catch(err => {
        console.log(err)
      })
    }
      const dataSource = [...this.state.dataSource];
      this.setState({ dataSource: dataSource.filter(item => item.count !== key.count) });
    }
    handleAdd ()  {
      const {count, dataSource,orderId } = this.state;
        
      const newData = {
        itemName: '',
        itemNumber: 0,
        itemId: null,
        count:count+1,
        orderId:orderId
      };
      
      this.setState({
        dataSource: [...dataSource, newData],
        count: count+1,
      });
    }
    render() {

      const { dataSource } = this.state;
      const columns = this.columns;
      return (
        <div>
          <Button className="editable-add-btn" onClick={this.handleAdd.bind(this)}>添加订单详情</Button>
          <Table bordered dataSource={dataSource} columns={columns} />
        </div>
      );
    }
  }
export default OrderEdit;