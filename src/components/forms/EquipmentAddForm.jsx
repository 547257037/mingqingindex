import React from 'react';
import ReactDOM from 'react-dom';

import { InputNumber, Modal, Form, Input, Radio, Select, DatePicker, TimePicker,Space,message  } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';


var axios = require('axios');
moment.locale('zh-cn');
var Base = require('../../baseConst.js');
var token = window.localStorage.getItem('token');
var vendorAll=[];
var vendorAll2=[];

axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;


const EquipmentAddForm = Form.create()(
    (props) => {
       
        const { addVisible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={ addVisible}
                title='添加设备信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
               <Form layout='vertical'>
                    <FormItem label='设备名称'>
                        {getFieldDecorator('equipmentName', {
                            rules: [{ required: true, message: '设备名称' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='设备单价'>
                        {getFieldDecorator('equipmentPrice', {
                            rules: [{ required: true, message: '请填设备单价' }],
                        })(
                            <InputNumber
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                         
                          />
                        )}
                    </FormItem>
                    <FormItem label='设备数量'>
                        {getFieldDecorator('equipmentNumber', {
                            rules: [{ required: true, message: '请填写设备数量' }],
                        })(
                            <InputNumber min={0} />
                        )}
                    </FormItem>
                    <FormItem label='设备类型'>
                        {getFieldDecorator('equipmentType', {
                            rules: [{ required: true, message: '请填设备类型' }],
                        })(
                            <Select style={{ width: 120 }}  >
                                <Option key='0'>车床</Option>
                                <Option key='1'>铣床</Option>
                                <Option key='2'>数控</Option>
                                <Option key='3'>其他</Option>
                            </Select>

                        )}
                    </FormItem>
                    <FormItem label='设备图片'>
                        {getFieldDecorator('equipmentUrl', {
                        })(
                            <Input />
                        )}
                    </FormItem>
        
                    <FormItem label='设备保质期'>
                        {getFieldDecorator('expirationDate', {
                            rules: [{ required: true, message: '请填写设备保质期' }],
                        })(
                            <DatePicker format="YYYY-MM-DD " />
                        )}
                    </FormItem>

                    <FormItem label='生产厂商'>
                        {getFieldDecorator('productionVendorName', {
                           
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='厂商名称'>
                        {getFieldDecorator('vendorId', {
                            rules: [{ required: true, message: '生产厂商' }],

                        })(
                            <Select style={{ width: 120 }}  >

                                {vendorAll.map(city => (

                                    <Option key={city.vendorId}>{city.vendorName}</Option>

                                )
                                )}

                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
);

class EquipmentAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addVisible: false
 
            }
        }
    componentWillMount(){
        this.selectChange(); 
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

    handleCreate() {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var json = {};
            json = values;
            axios.post(Base.inventoryAPI + '/inventory-equipment/add', json)
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
                <EquipmentAddForm
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

export default EquipmentAdd;