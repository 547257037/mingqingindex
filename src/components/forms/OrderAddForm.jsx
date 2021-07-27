import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Modal, Form, Input, Table, Select, DatePicker, Icon,Popconfirm,message,InputNumber  } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';

var vendorAll=[];
var itemAll=[];

var UpdateinventoryOrderDetailVOS= [];var axios = require('axios');
moment.locale('zh-cn');
var Base = require('../../baseConst.js');
var token = window.localStorage.getItem('token');


axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const OrderAddForm = Form.create()(
    (props) => {
       
        const { addVisible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={ addVisible}
                title='添加菜单信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
                      <Form layout='vertical'>
                    <FormItem label='生产厂商'>
                        {getFieldDecorator('submitVendorId', {
                            rules: [{ required: true, message: '请填写生产厂商' }],
                        })(
                            <Select  style={{ width: 120 }}  >

                            {vendorAll.map(city => (

                                <Option value={city.vendorId}>{city.vendorName}</Option>

                            )
                            )}

                        </Select>
                        )}
                    </FormItem>
            
                    <FormItem label='收货厂商'>
                        {getFieldDecorator('receiveVendorId', {
                            rules: [{ required: true, message: '请填写收货厂商' }],
                        })(
                            <Select  style={{ width: 120 }}  >

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
                        })(
                            <DatePicker  format="YYYY-MM-DD" />
                        )}
                    </FormItem>
                    
                    <FormItem label='交货时间'>
                        {getFieldDecorator('submitDate', {
                            rules: [{ required: true, message: '请填写商品保质期' }],
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>

{/*                     
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
                    </FormItem> */}
                    <FormItem label='订单备注'>
                        {getFieldDecorator('remark', {
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem label='订单详情'>
                        {getFieldDecorator('inventoryOrderDetailVOS', {

                        })(
                          
                            <EditableTable  />

                        )}
                    </FormItem>


                </Form>
            </Modal>
        )
    }
);

class OrderAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addVisible: false
 
            }
        }
    componentWillMount(){ 
         this.selectChange(); 
        this.selectChange2(); 
    }
    componentWillReceiveProps(nextProps) {

        this.setState({
            addVisible: nextProps.showPopAdd,
        });
    }
    showModal() {
        this.setState({
            addVisible: true
        })
    }

    handleCancel() {
        this.setState({
            addVisible: false
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


    handleCreate() {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var json = {};
            json = values;
            json.inventoryOrderDetailVOS= UpdateinventoryOrderDetailVOS.filter(item => item.itemId != null) 
            axios.post(Base.inventoryAPI + '/inventory-order/add', json)
                .then(result => {
                    if (result.status === 200 && result.data.code === 200) {
                        this.props.getUser();
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
                <OrderAddForm
                    ref={this.saveFormRef.bind(this)}
                    addVisible={this.state.addVisible}
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

    
      this.state = {
        dataSource : [],
        count:count,
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

export default OrderAdd;