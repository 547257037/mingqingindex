import React from 'react';

import { TreeSelect , Modal, Form, Input, Radio, Select, DatePicker, TimePicker, Space, message } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
import moment from 'moment';


var axios = require('axios');
moment.locale('zh-cn');
var Base = require('../../baseConst.js');
var token = window.localStorage.getItem('token');
var vendorAll = [];
var treeData = [
  ];
  

axios.defaults.headers.common['Authorization'] = token;
const FormItem = Form.Item;






const RoleEditForm = Form.create()(
    (props) => {

        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title='修改角色信息'
                okText='确认'
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout='vertical'>
                    <FormItem label='角色名称'>
                        {getFieldDecorator('roleName', {
                            rules: [{ required: true, message: '角色名称' }],
                            initialValue: props.infos.roleName

                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label='是否管理角色'>
                        {getFieldDecorator('isAdminRole', {
                            initialValue: props.infos.isAdminRole
                        })(
                            <Select defaultValue={props.infos.isAdminRole} style={{ width: 120 }}>
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        )}
                    </FormItem>

                    <FormItem label='授权菜单'>
                        {getFieldDecorator('menus', {
                            initialValue: props.infos.menus
                        })(
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                value={props.infos.menus}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="配置菜单"
                                allowClear
                                treeCheckable={false}
                                multiple
                                treeDefaultExpandAll
                                onChange={this.onChange}
                                treeData={treeData}
                                showCheckedStrategy= {'SHOW_PARENT'}
                                placeholder='Please select'
                                

                            />
                            )}

                            
                    </FormItem>
                    <FormItem label='厂商名称'>
                        {getFieldDecorator('vendorId', {
                            initialValue: props.infos.vendorId

                        })(
                            <Select defaultValue={props.infos.vendorId} style={{ width: 120 }}  >

                                {vendorAll.map(city => (

                                    <Option value={city.vendorId}>{city.vendorName}</Option>

                                )
                                )}

                            </Select>
                        )}

                    </FormItem>
                    <FormItem label='说明'>
                        {getFieldDecorator('remark', {
                            initialValue: props.infos.remark
                        })(<Input />
                            )}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
);

class RoleEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            infos: {
                vendorId: "",
                roleName: "",
                vendorName: "",
                roleId: "",
                roleName: "",
                isAdminRole: "",
                isDeleted: "",
                remark: "",
                menus:[],
                createdUserId: "",
                modifyiedUserId: "",
                modifyiedTime: "",
                createdTime: ""
            }
        }
    }
    componentWillMount() {
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
    selectChange() {
        axios.get(Base.userAPI + '/inventory-vendor/getAll')
            .then(result => {
                if (result.status === 200 && result.data.code === 200) {
                    vendorAll = result.data.data

                }
                if (result.data.type !== 'success') {
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


    handleCreate() {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            var json = {};
            json = values;
            json.roleId = this.state.infos.roleId;
            axios.put(Base.userAPI + '/base-role/update', json)
                .then(result => {
                    if (result.status === 200 && result.data.code === 200) {
                        this.props.getUser();
                    }
                    if (result.data.type !== 'success') {
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
                <RoleEditForm
                    ref={this.saveFormRef.bind(this)}
                    visible={this.state.visible}
                    infos={this.state.infos}
                    onCancel={this.handleCancel.bind(this)}
                    onCreate={this.handleCreate.bind(this)}
                />
            </div>
        );
    } onCreate
}

export default RoleEdit;