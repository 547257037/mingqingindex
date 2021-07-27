import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Modal, Form, Input, InputNumber , Select, DatePicker, TimePicker,Space,message  } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';


var axios = require('axios');
moment.locale('zh-cn');
var Base = require('../../baseConst.js');
var token = window.localStorage.getItem('token');
var vendorAll=[];
var materialAll=[];
var itemAll=[];
var equipmentAll=[];
var userAll=[];

axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const EmployeesOutputAddForm = Form.create()(
    (props) => {
       
        const { addVisible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={ addVisible}
                title='添加产出信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
              <Form layout='vertical'>
                    <FormItem label='产出员工'>
                        {getFieldDecorator('userId', {
                            rules: [{ required: true, message: '请填写产出员工' }],
                        })(
                            
                            <Select style={{ width: 120 }}  >
                                     
                            {userAll.map(city=>(
                        
                                <Option key={city.userId}>{city.userName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>
                    <FormItem label='厂商名称'>
                        {getFieldDecorator('vendorId', {
                          rules: [{ required: true, message: '生产厂商' }],

                        })(
                            <Select  style={{ width: 120 }}  >
                                     
                            {vendorAll.map(city=>(
                        
                                <Option key={city.vendorId}>{city.vendorName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>
                    <FormItem label='产出商品'>
                        {getFieldDecorator('itemId', {
                            rules: [{ required: true, message: '请填写产出商品' }],
                        })(
                            <Select  style={{ width: 120 }}  >
                                     
                            {itemAll.map(city=>(
                        
                                <Option key={city.itemId}>{city.itemName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>
                    <FormItem label='产出数量'>
                        {getFieldDecorator('outputNumber', {
                            rules: [{ required: true, message: '请填写产出数量' }],
                        })(
                            <InputNumber min={0} />
                        )}
                    </FormItem>

                    <FormItem label='使用材料'>
                        {getFieldDecorator('materialId', {
                            rules: [{ required: true, message: '请填写使用材料' }],
                        })(
                            <Select style={{ width: 120 }}  >
                                     
                            {materialAll.map(city=>(
                        
                                <Option key={city.materialId}>{city.materialName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>

    

                    <FormItem label='报废数量'>
                        {getFieldDecorator('scrapNumber', {
                            rules: [{ required: true, message: '请填写报废数量' }],
                        })(
                            
                       <InputNumber min={0} />

                            
                        )}
                    </FormItem>
                    <FormItem label='使用设备名称'>
                        {getFieldDecorator('equipmentId', {
                            rules: [{ required: true, message: '请填写使用设备名称' }],
                        })(
                            <Select  style={{ width: 120 }}  >
                                     
                            {equipmentAll.map(city=>(
                        
                                <Option key={city.equipmentId}>{city.equipmentName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>
                    <FormItem label='产出开始时间'>
                        {getFieldDecorator('outputTimeStart', {
                            rules: [{ required: true, message: '请填写产出开始时间' }],
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>

                    <FormItem label='产出结束时间'>
                        {getFieldDecorator('outputTimeEnd', {
                            rules: [{ required: true, message: '产出结束时间' }],
                        })(
                            <DatePicker  format="YYYY-MM-DD " />
                        )}
                    </FormItem>
                   
                </Form>
            </Modal>
        )
    }
);

class EmployeesOutputAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addVisible: false
 
            }
        }
        componentWillMount(){
            this.selectChange(); 
            this.selectChange2(); 
            this.selectChange3(); 
            this.selectChange4();
            this.selectChange5();  
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
        axios.get(Base.inventoryAPI + '/inventory-material/getAll')
        .then(result => {
            if (result.status === 200 && result.data.code === 200) {
                materialAll=result.data.data
           
            }
            if(result.data.type!=='success'){
                message.error(result.data.message)
            }
        }) 
         .catch(err => {
            console.log(err)
        })
    }

    selectChange3(){
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

    selectChange4(){
        axios.get(Base.inventoryAPI + '/inventory-equipment/getAll')
        .then(result => {
            if (result.status === 200 && result.data.code === 200) {
                equipmentAll=result.data.data
           
            }
            if(result.data.type!=='success'){
                message.error(result.data.message)
            }
        }) 
         .catch(err => {
            console.log(err)
        })
    }

    selectChange5(){
        axios.get(Base.userAPI + '/base-user/getAll')
        .then(result => {
            if (result.status === 200 && result.data.code === 200) {
                userAll=result.data.data
           
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
            axios.post(Base.inventoryAPI + '/inventory-employees-output/add', json)
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
                <EmployeesOutputAddForm
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

export default EmployeesOutputAdd;