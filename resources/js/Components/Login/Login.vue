<template>
<div>
    <div class="row">
        <div class="col-md-6 offset-md-3">
            <div class="row">
                <div class="card col-xs-12 text-white bg-primary" style="width: 100%;">
                    <div class="card-header">Sign in</div>
                    <div class="card-body">
                        <div class="form-group">
                            <div class="text-danger"
                            v-if="states.res"
                            >
                                {{ states.res }}
                            </div>
                            <label for="exampleInputEmail1">Email address</label>
                            <input type="email"
                            class="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            placeholder="Enter email" style=""
                            v-model="form.email"
                            >
                            </input>

                            <label>Password</label>
                            <input type="password" class="form-control"
                            v-model="form.password"
                            >
                        </div>
                        <div class="form-group">
                            <button class="btn btn-success"
                            v-on:click="submit"
                            :disabled="!can_submit"
                            :class="{disabled: !can_submit}"
                            >
                                sign in
                            </button>
                        </div>
                        <small>
                            <a href="/password/start-reset">I lost my password</a>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
    import AuthApi from '../../API/AuthApi.js';
    let authApi = new AuthApi();
    export default {
        data() {
            return {
                form: {
                    email: null,
                    password: null
                },
                states: {
                    res: null,
                }
            };
        },
        methods: {
            submit() {
                this.states.res = null;
                authApi.login(this.form.email, this.form.password)
                .then(res => {
                    if (res && res.token) {
                        document.cookie = `raxxla_auth=${res.token}`;
                        window.location.href = "/";
                    } else
                        this.states.res = `Empty response.`

                }).catch(err => {
                    if (err.status && err.status === 401) {
                        let err = `Bad password or email.`;
                        this.states.res = err;
                    } else {
                        this.states.res = `Unknown authentication error.`
                    }
                });
            }
        },
        computed: {
            valid_email() {
                let email = this.form.email || "";
                let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let m = email.match(regex);
                return m && m.length > 0;
            },
            fields_filled() {
                let valid = true;
                let keys = ['email', 'password'];
                for (let key of keys) {
                    let val = this.form[key];
                    if (!val || !val.length)  valid = false;
                }
                return valid;
            },
            can_submit() {
                return this.fields_filled === true &&
                    this.valid_email === true;
            }
        }
    }
</script>


