<template>
    <div class="container">
        <div class="card" style="width: 100%;">
            <div class="card-body">
                <loader :loaded="states.ready === true"></loader>
                <div v-if="states.ready">
                    <div class="row">
                        <div class="col">
                            <h3>{{expedition.name}}</h3>
                            <div>
                                <b-progress :max="expedition.stats.bodies_count">
                                    <b-progress-bar :value="expedition.stats.bodies_explored_count" variant="success">
                                        {{expedition.stats.bodies_explored_count}} bodies explored / {{expedition.stats.bodies_count}}
                                        </span>
                                    </b-progress-bar>
                                </b-progress>
                            </div>
                        </div>
                        <div class="col text-right">
                            <span class="badge"
                                :class="status_badge">
                                {{expedition.status}}
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col" v-html>
                        {{ expedition.description }}
                        </div>
                    </div>
                    <div class="row">
                        <hr></hr>
                    </div>

                    <div class="row">
                        <div class="col">
                            Systems :
                            <div class="card" v-for="system in expedition.systems" style="width: 100%">
                                <div class="card-header">
                                    <strong>
                                        <a href="#"
                                            v-on:click="states.body_shown = system.id">
                                            <span class="icon ion-md-arrow-dropright"
                                                v-if="system.id !== states.body_shown"
                                                >
                                            </span>

                                            <span class="icon ion-md-arrow-dropdown"
                                                v-if="system.id === states.body_shown"
                                                >
                                            </span>
                                            {{system.name}}

                                        </a>
                                    </strong>

                                    <a href="#"
                                        v-on:click="states.body_shown = system.id">
                                        <span class="badge badge-primary">
                                            {{getSystemProgress(system)}}/{{system.bodies.length}}
                                        </span>
                                    </a>
                                </div>
                                <div class="card-body" v-show="system.id === states.body_shown">
                                    <loader :loaded="!states.table_loading"></loader>
                                    <table class="table" v-show="!states.table_loading" style="margin-top: -20px;">
                                        <thead>
                                            <tr>
                                                <th style="border-top: none;">
                                                    Name
                                                </th>
                                                <th style="border-top: none;">
                                                    Last explored
                                                </th>
                                                <th style="border-top: none;">
                                                    Explored on platforms
                                                </th>
                                                <th style="border-top: none;">
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="body in system.bodies">
                                                <td>
                                                    <span
                                                        v-if="body.visitables.length"
                                                        class="icon ion-md-checkmark-circle text-success">
                                                    </span>

                                                    <span
                                                        v-if="!body.visitables.length"
                                                        class="icon ion-md-close-circle text-danger">
                                                    </span>

                                                    {{body.name}}
                                                </td>
                                                <td>
                                                    {{getLastExplored(body)}}
                                                    <div v-show="body.visitables.length">
                                                        <small>
                                                            <a href="#" v-on:click="showHistory(body.visitables)">
                                                                show history
                                                            </a>
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <i v-for="visitable in filterBodyVisitables(body.visitables)"
                                                        v-if="visitable.platform"
                                                        class="icon"
                                                        v-b-tooltip.hover :title="generatePlatformTooltip(visitable)"
                                                        style="margin-right: 7px;"
                                                        :class="getPlatformIcon(visitable.platform)">
                                                    </i>
                                                </td>
                                                <td>
                                                    <button class="btn btn-primary btn-sm"
                                                        v-on:click="showUpdateModal(system, body)"
                                                        >
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div style="margin-top: 15px;">
                                <b-pagination size="md"
                                :total-rows="expedition.stats.systems_count"
                                v-model="states.current_page"
                                :per-page="states.page_rows"
                                align="center"
                                >
                                </b-pagination>
                            </div>

                            <b-modal
                                ref="body_update_modal"
                                :title="states.update_buffer.modal_name"
                                hide-footer
                                size="lg"
                                >
                                <div class="d-block text-center" v-if="!is_logged_in">
                                    Only signed in users can update expeditions.
                                </div>
                                <div class="d-block text-center" v-if="is_logged_in">
                                    <form @prevent.default>
                                        <div class="form-group">
                                            <label>Platform</label>
                                            <select v-model="states.update_buffer.form.platform" class="form-control">
                                                <option disabled value="">Choose</option>
                                                <option  value="pc">PC</option>
                                                <option  value="ps4">PS4</option>
                                                <option  value="xbox_one">Xbox One</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <div class="form-check">
                                                <label class="form-check-label">
                                                    <input type="checkbox"
                                                    class="form-check-input"
                                                    v-model="states.update_buffer.form.visited"
                                                    value="true"
                                                    />
                                                    I have visited (less than 100ls) or scanned this body.
                                                </label>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <input type="button"
                                                :disabled="!states.update_buffer.form.platform || !states.update_buffer.form.visited"
                                                class="btn btn-success"
                                                value="Submit"
                                                v-on:click="submitVisited()"
                                                />
                                        </div>
                                    </form>
                                </div>
                            </b-modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ExpeditionsApi from '../../API/ExpeditionsApi.js';
    import SessionStore from './../../Framework/SessionStore.js';
    const session = SessionStore.getInstance();
    import _ from 'lodash';
    import moment from 'moment';
    const expeApi = new ExpeditionsApi();
    const $pages_buffer = {};
    export default {
        data() {
            return {
                states: {
                    ready: false,
                    table_loading: false,
                    body_shown: null,
                    page_rows: 5,
                    current_page: 1,
                    update_buffer: {
                        modal_name: null,
                        system: null,
                        body: null,
                        form: {
                            platform: session.getStore().platform,
                            visited: false
                        }
                    }
                },
                expedition: {}
            };
        },
        props: {
            id: {
                type: Number,
                required: true
            }
        },
        watch: {
            'states.current_page': {
                handler(current_page) {
                    if (!this.states.ready) return;
                    this.fetchSystemsPage(current_page, true);
                }
            }
        },
        mounted() {
            return this.fetchSystemsPage(1, false)
            .then(() => {
                this.states.ready = true;
                return 1;
            });
        },
        methods: {
            submitVisited() {
                let visitable = {
                    visitable_type: 'body',
                    visitable_id: this.states.update_buffer.body.id,
                    user_id: session.getStore().id,
                    report_method: 'manual',
                    platform: this.states.update_buffer.form.platform
                };
                return expeApi.sendVisitableUpdate(visitable).then(res => {
                    visitable.date = 'now';
                    visitable.user = session.getStore();
                    // if never explored, we increment the bodies explored count
                    if (this.states.update_buffer.body.visitables.length === 0)
                        this.expedition.stats.bodies_explored_count++;

                    let system_index = _.findIndex(this.expedition.systems
                        , {id: this.states.update_buffer.system.id});
                    if (system_index < 0) throw new Error(`cant find system index`);
                    let body_index = _.findIndex(this.expedition.systems[system_index].bodies
                        , { id: this.states.update_buffer.body.id});
                    if (body_index < 0) throw new Error(`cant find body index`);
                    this.expedition.systems[system_index].bodies[body_index]
                        .visitables.push(visitable);
                    this.hideUpdateModal();
                });
            },
            showUpdateModal(system, body) {
            this.states.update_buffer = {
                system,
                body,
                form: {
                platform: session.getStore().platform,
                    visited: false
                }
            };
                this.states.update_buffer.modal_name = `Update ${system.name} > ${body.name}`;
                this.$refs.body_update_modal.show();
            },
            hideUpdateModal() {
                this.states.update_buffer =  {
                    system: null,
                    body: null,
                    modal_name: null,
                    form: {
                    platform: session.getStore().platform,
                        visited: false
                    }
                };
                this.$refs.body_update_modal.hide();
            },
            fetchSystemsPage(current_page, partial) {
                    this.states.table_loading = true;
                    let systems = $pages_buffer['page_' + current_page];
                    let p;
                    if (systems) p = new Promise(resolve => resolve({systems}))
                    else {
                        let offset = (current_page - 1) * this.states.page_rows;
                        p = expeApi.fetchExpedition(this.id, offset, partial);
                    }
                    return p.then(data => {
                        let systems = data.systems;
                        $pages_buffer['page_' + current_page] = systems;
                        if (partial) this.expedition.systems = systems;
                        else this.expedition = data;
                        this.states.table_loading = false;
                        return 1;
                    });
            },
            generatePlatformTooltip(visitable) {
                let d = visitable.date.slice(0, 10);
                let user = _.get(visitable, 'user.name');
                return `${d} by CMDR ${user}`;
            },
            filterBodyVisitables(visitables) {
                    return _.chain(visitables)
                    .orderBy(able => able.date
                    , 'desc')
                    .uniqBy(able => {
                        return able.platform;
                    }).value();
            },
            getPlatformIcon(plat) {
                    let map = {
                        pc: 'ion-md-desktop',
                        ps4: 'ion-logo-playstation',
                        xbox_one: 'ion-logo-xbox',
                    }
                    return map[plat]
            },
            getLastExplored(body) {
                let visitables = body.visitables || [];
                if (!visitables.length) return null;
                let last = this.getLastVisitable(visitables);
                return last.date.slice(0, 10);
            },

            getLastPlatform(body) {
                let visitables = body.visitables || [];
                if (!visitables.length) return null;
                let last = this.getLastVisitable(visitables);
                return last.platform;
            },

            getLastVisitable(visitables) {
                visitables = _.orderBy(visitables, able => able.date
                , 'desc');
                return visitables[0];
            },
            showHistory(visitables) {
            },
            getSystemProgress(system) {
                let bodies = _.get(system, 'bodies') || [];
                let visited = _.filter(bodies, body => {
                    return body.visitables
                    && body.visitables.length > 0
                });
                return visited.length;
            },
            getExploredCount() {
                let explored = 0;
                let systems = this.expedition.systems;
                if (!systems) return 0;
                systems.forEach(system => {
                    explored += this.getSystemProgress(system);
                });
                return explored;
            },
            getBodyCount() {
                let bodies = 0;
                let systems = this.expedition.systems;
                if (!systems) return 0;
                systems.forEach(system => {
                    bodies += system.bodies.length;
                });
                return bodies;
            },
            getOverallProgress() {
                let explored = 0;
                let bodies = 0;
                let systems = this.expedition.systems;
                if (!systems) return 0;
                systems.forEach(system => {
                    bodies += system.bodies.length;
                    explored += this.getSystemProgress(system);
                });
                return (explored / bodies) * 100;
            }

        },
        computed: {
            is_logged_in() {
                return session.getStore().id > 0;
            },
            status_badge() {
                let stat = this.expedition.status || "";
                stat = stat.toLowerCase();
                return {
                    'badge-info': stat === 'active',
                    'badge-default': stat !== 'active'
                };
            }
        }
    }
    </script>
