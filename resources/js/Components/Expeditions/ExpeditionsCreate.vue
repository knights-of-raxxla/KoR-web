<template>
<div class="container">
    <div class="card" style="margin-top: 30px;">
        <div class="card-body">
            <form @prevent.default>
                <div class="form-group">
                    <h4>Basic info</h4>
                    <label>Expedition Name</label>
                    <input type="text"
                    v-model="form.name"
                    class="form-control">

                    <label>Expedition description (HTML allowed)</label>
                    <textarea
                        type="text"
                        class="form-control"
                        v-model="form.description"
                        />
                    <label>Current Status</label>
                    <select class="form-control">
                        <option v-for="opt in options.status">
                            {{opt}}
                        </option>
                    </select>

                </div>

                <h4>Settings</h4>
                <div class="form-check">
                    <label class="form-check-label">
                        <input type="radio"
                            class="form-check-input"
                            v-model="form.ignore_before_toggle"
                            value="true"
                        />
                   Ignore explored bodies before a given date
                    </label>
                </div>
                <div class="form-group" v-if="form.ignore_before_toggle === 'true'">
                    <label>Ignore explored bodies before</label>
                    <datepicker
                        :config="config.datepicker"
                        :value.sync="form.ignore_before"
                    ></datepicker>

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

                        <label>Include systems within Radius (sphere, max 200ly)</label>
                        <div class="input-group mb-3">
                            <input type="number"
                                class="form-control"
                                v-model="form.systems.radius"
                                min="10"
                                max="200"
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
                        <label>Selected systems:</label>
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
    const expeApi = new ExpeditionsApi();
    export default {
        data() {
            return {
                form: {
                    name: null,
                    description: null,
                    ignore_before: null,
                    ignore_before_toggle: null,
                    systems: {
                        method: null,
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
            },
            searchSystem(text) {
                if (!text || text.length < 2) return;
                expeApi.searchSystem(text)
                .then(systems => {
                    systems = _.filter(systems, system => {
                        return !_.find(this.form.systems.selected, {id: system.id});
                    });
                    this.options.systems = systems;
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
            // TODO create validators
            form_valid() {
                return false;
                return true;
            }
        }
    }
</script>
