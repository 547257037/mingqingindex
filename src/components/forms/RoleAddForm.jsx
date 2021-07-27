import React from 'react';
import ReactDOM from 'react-dom';

import { TreeSelect, Modal, Form, Input, Radio, Select, DatePicker, TimePicker,Space,message  } from 'antd';

const { RangePicker } = DatePicker;
import moment from 'moment';

var vendorAll=[];
var axios = require('axios');
moment.locale('zh-cn');
var Base = require('../../baseConst.js');
var token = window.localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;

var vendorAll = [];
var treeData = [
  ];
const RoleAddForm = Form.create()(
    (props) => {
        const { addVisible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={addVisible}
                title='添加角色信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout='vertical'>
                <FormItem label='角色名称'>
                        {getFieldDecorator('roleName', {
                            rules: [{ required: true, message: '角色名称' }],

                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='是否管理角色'>
                        {getFieldDecorator('isAdminRole ', {
                            rules: [{ required: true, message: '是否管理角色' }],

                        })(
                            <Select defaultValue='0' style={{ width: 120 }}>
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        )}
                    </FormItem>
               
                   
                    <FormItem label='厂商名称'>
                        {getFieldDecorator('vendorId', {
                        rules: [{ required: true, message: '厂商名称' }],

                        })(
                            
                            <Select  style={{ width: 120 }}  >
                                     
                            {vendorAll.map(city=>(
                        
                                <Option  value={city.vendorId}>{city.vendorName}</Option>
                    
                            )
                            )}
                          
                          </Select>
                        )}
                    </FormItem>

                    <FormItem label='授权菜单'>
                        {getFieldDecorator('menus', {
                        })(
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                value={[]}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="配置菜单"
                                allowClear
                                treeCheckable={false}
                                multiple
                                treeDefaultExpandAll
                                onChange={this.onChange}
                                treeData={treeData}
                                showCheckedStrategy= {'SHOW_PARENT'}

                            
                            />
                            )}

                            
                    </FormItem>
                    <FormItem label='说明'>
                        {getFieldDecorator('remark', {
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
);


class RoleAdd extends React.Component {
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
            addVisible: nextProps.showPopAdd
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
    selectChange2() {
        axios.get(Base.userAPI + '/base-menu/get-base-menu-tree')
            .then(result => {
                if (result.status === 200 && result.data.code === 200) {
                    treeData = result.data.data

                }
                if (result.data.type !== 'success') {
                    message.error(result.data.message)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }


    handleCreateAdd() {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var json = {};
            json = values;
            axios.post(Base.userAPI + '/base-role/add', json)
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
            this.setState({ addVisible: false })
        })
    }
    saveFormRef(form) {
        this.form = form;
    }
    render() {
        return (
            <div>
                <RoleAddForm
                    ref={this.saveFormRef.bind(this)}
                    addVisible={this.state.addVisible}
                    onCancel={this.handleCancel.bind(this)}
                    onCreate={this.handleCreateAdd.bind(this)}
                />
            </div>
        );
    }onCreate
}

export default RoleAdd;