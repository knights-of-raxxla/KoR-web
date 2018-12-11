<template>
<div class="container">
    <div class="card" style="margin-top: 30px;">
        <div class="card-header">
            Create an expedition
        </div>
        <div class="card-body">
            <div v-if="!is_logged_in">
                You need to <a href="/signin"> sign in</a> to create expeditions.
            </div>
            <loader :loaded="!states.loading"></loader>
            <form @prevent.default v-show="!states.loading && is_logged_in">
                <div class="form-group">
                    <h4>Basic info</h4>
                    <label>Expedition Name</label>
                    <input type="text"
                    required=true
                    v-model="form.name"
                    class="form-control">
                    <div class="text-danger" v-if="form.name && form.name.length && !name_valid">
                        Please provide a valid expedition name of at least 3 characters.
                    </div>

                    <label>Expedition description (HTML allowed)</label>
                    <textarea
                        type="text"
                        class="form-control"
                        v-model="form.description"
                        />
                    <label>Current Status</label>
                    <select class="form-control"
                        v-model="form.status"
                    >
                        <option v-for="opt in options.status">
                            {{opt}}
                        </option>
                    </select>
                    <div class="text-danger" v-if="form.status && form.status.length && !status_valid">
                        Please select a status.
                    </div>
                </div>

                <div class="form-group">
                    <h4>Settings</h4>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="checkbox"
                                class="form-check-input"
                                v-model="form.ignore_before_toggle"
                                value="true"
                            />
                       Ignore scanned bodies before a given date
                        </label>
                        <div class="text-danger" v-if="!ignore_valid">
                            You need to select a date.
                        </div>
                    </div>
                    <div class="form-group" v-if="form.ignore_before_toggle ===  true ">
                        <label>Ignore scanned bodies before</label>
                        <datepicker
                            :config="config.datepicker"
                            v-model="form.ignore_before"
                        ></datepicker>

                    </div>
                </div>

                <div class="form-group">
                    <h4>Systems</h4>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input class="form-check-input"
                            v-model="form.systems.method"
                            type="radio"
                            value="manual">
                            I'll input a list of systems.
                            </input>
                        </label>
                    </div>

                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="radio"
                            v-model="form.systems.method"
                            value="center"
                            class="form-check-input"
                            />
                            I want to select all systems centered around a given system within a given radius.
                        </label>
                    </div>
                </div>
                <div clas="form-group">

                    <div class="form-group" v-if="form.systems.method === 'center'">
                        <label>Center system</label>
                        <model-list-select
                            :list="options.systems"
                            option-value="id"
                            option-text="name"
                            v-model="form.systems.center"
                            placeholder="search a system"
                            @searchchange="searchSystem"
                        ></model-list-select>

                        <label>Include systems within Radius (sphere, max 50ly)</label>
                        <div class="input-group mb-3">
                            <input type="number"
                                class="form-control"
                                v-model="form.systems.radius"
                                min="10"
                                max="51"
                            />
                            <div class="input-group-append">
                                <span class="input-group-text" id="basic-addon2">ly</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-group" v-if="form.systems.method === 'manual'">
                        <label>Add a system</label>
                        <model-list-select
                            :list="options.systems"
                            option-value="id"
                            option-text="name"
                            v-model="buffer.system"
                            placeholder="search a system"
                            @searchchange="searchSystem"
                            @select="onSystemSelected"
                        ></model-list-select>
                    </div>
                    <div class="form-group" v-if="form.systems.selected.length">
                        <label>Selected systems ({{form.systems.selected.length}}):</label>
                        <table class="table table-sm">
                            <tbody>
                            <tr v-for="system in form.systems.selected">
                                <td>
                                    {{system.name}}
                                </td>
                                <td>
                                    <button type="button"
                                        class="btn btn-default"
                                        v-on:click="removeSystem(system)"
                                        @prevent.default>
                                        <i class="icon ion-md-close"></i>
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="form-group">
                    <div class="text-danger" v-if="!systems_valid">
                        You need to select at least 1 system to create an expedition.
                    </div>
                </div>
                <div class="form-group tex-center">
                    <input type="button" class="btn btn-primary"
                    v-on:click="submit"
                    value="Create expedition"
                    :disabled="!form_valid"
                    >
                    </input>
                </div>
            </form>
        </div>
    </div>
</div>
</template>
<script>
    import _ from 'lodash';
    import ExpeditionsApi from '../../API/ExpeditionsApi.js';
    import SessionStore from '../../Framework/SessionStore.js';
    const session = SessionStore.getInstance();
    const expeApi = new ExpeditionsApi();
    import InputChange from '../../Components/Utils/InputChange.js';
    let searchSystemChange = new InputChange();
    export default {
        data() {
            return {
                form: {
                    name: null,
                    description: null,
                    ignore_before: "",
                    ignore_before_toggle: null,
                    status:'Active',
                    systems: {
                        method: 'manual',
                        selected: [],
                        center: null
                    }
                },
                config: {
                    datepicker: {
                        format: 'YYYY-MM-DD'
                    }
                },
                options: {
                    status: [
                        'Active',
                        'Preparing',
                    ],
                    systems: []
                },
                buffer: {
                    system: null
                },
                states: {
                    loading: false
                }
            }
        },
        watch: {
            'buffer.system': {
                handler(newVal) {
                    if (newVal) this.onSystemSelected(newVal);
                }
            }
        },
        methods: {
            submit() {
                this.states.loading = true;
                expeApi.createExpedition(this.form)
                    .then(out => {
                        let loc = `/expeditions/${out.expedition_id}`;
                        window.location.href = loc;
                    }).catch(err => {
                        throw new Error(err);
                    });
            },
            searchSystem(text) {
                if (!text || text.length < 2) return;
                searchSystemChange.watch().then(() => {
                    expeApi.searchSystem(text)
                    .then(systems => {
                        systems = _.filter(systems, system => {
                            return !_.find(this.form.systems.selected, {id: system.id});
                        });
                        this.options.systems = systems;
                    });
                });
            },
            onSystemSelected(id) {
                let full_system = _.find(this.options.systems, {id});
                this.form.systems.selected.push(full_system);
                this.buffer.system = null;
            },
            removeSystem(system) {
                let i = _.findIndex(this.form.systems.selected, {id: system.id});
                this.form.systems.selected.splice(i, 1);
            }
        },
        computed: {
            is_logged_in() {
                let store = session.getStore();
                if (!store) return false;
                return store.id > 0;
            },
            name_valid() {
                return this.form.name &&
                    this.form.name.length > 3;
            },
            status_valid() {
                return this.form.status &&
                this.form.status.length > 0;
            },
            ignore_valid() {
                let is = this.form.ignore_before_toggle;
                if (is === null) return true;
                if (is === false) return true;
                return this.form.ignore_before &&
                this.form.ignore_before.length > 0;
            },
            systems_valid() {
                let radio_val = this.form.systems.method;
                if (radio_val === null) return false;
                if (['manual', 'center'].indexOf(radio_val) === -1)
                    return false;
                let systems = this.form.systems.selected;
                let systems_valid = systems && systems.length > 0;
                if (radio_val === 'manual') {
                    return systems_valid;
                } else if (radio_val === 'center') {
                    return this.form.systems.center && this.form.systems.center > 0
                        && this.form.systems.radius > 10 && this.form.systems.radius < 200;

                }
            },
            form_valid() {
                return this.name_valid === true &&
                this.status_valid === true &&
                this.ignore_valid === true &&
                this.systems_valid === true &&
                ['manual', 'center'].indexOf(this.form.systems.method) > -1;
            }
        }
    }
</script>
