<template>
    <div id="app">
        <el-form
            style="width:500px"
            :inline="false"
            :model="data"
            :rules="rules"
            ref="form"
            :validate-on-rule-change="false"
            status-icon
            label-width="100px"
            label-position="top"
            label-suffix=":~~"
            :disabled="false"
            size="small"
            :hide-required-asterisk="true"
        >
            <!-- hide-required-asterisk 控制✳号是否显示 -->
            <!-- validate-on-rule-change 为true时 ，在 rules 属性改变后立即触发一次验证 -->
            <el-form-item
                label="审批人"
                prop="user"
                :validate-status="status"
                :error="error"
            >
                <el-input v-model="data.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-select
                    v-model="data.region"
                    placeholder="活动区域"
                    style="width:100%"
                >
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="addRule"
                    >添加校验规则</el-button
                >
                <!-- <el-button type="success" @click="showSuccess"
                    >成功校验</el-button
                >
                <el-button type="danger" @click="showError">失败校验</el-button>
                <el-button type="warning" @click="showValidating"
                    >校验中</el-button
                > -->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
/* eslint-disable */

export default {
    name: "app",
    data() {
        // var userValidator = (rule, value, callback) => {
        //     if (value.length > 3) {
        //         callback();
        //     } else {
        //         callback(new Error("用户名长度必须大于3 "));
        //     }
        // };
        return {
            data: {
                user: "",
                region: ""
            },
            rules: {
                user: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    }
                    // { validator: userValidator, trigger: "blur" }
                ]
            },
            error: "",
            status: ""
        };
    },
    methods: {
        /* eslint-disable */
        onSubmit() {
            console.log(this.data);
            this.$refs.form.validate((isValid, err) => {
                console.log(isValid);
                console.log(err);

                if (isValid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        addRule() {
            const userValidator = (rule, value, callback) => {
                if (value.length > 3) {
                    callback();
                } else {
                    callback(new Error("用户名长度必须大于3 "));
                }
            };
            const newRule = [
                ...this.rules.user,
                { validator: userValidator, trigger: "blur" }
            ];
            this.rules = Object.assign({}, this.rules, { user: newRule });
        },
        showSuccess() {
            this.status = "success";
            this.error = "";
        },
        showError() {
            this.status = "error";
            this.error = "用户名输入有误";
        },
        showValidating() {
            this.status = "validating";
            this.error = "";
        }
    }
};
</script>

<style></style>
