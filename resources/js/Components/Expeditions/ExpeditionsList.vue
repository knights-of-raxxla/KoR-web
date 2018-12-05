<template>
    <div class="row">
        <div class="col" >
        <loader :loaded="states.ready"></loader>
            <div class="card" style="width: 100%; margin-bottom: 15px;"
                v-for="expe in expeditions"
                v-show="states.ready"
            >
                <div class="card-body">
                    <a :href="'/expeditions/' + expe.id">
                        <h5>{{expe.name}}</h5>
                    </a>
                    <b-progress :max="expe.stats.bodies_count">
                        <b-progress-bar :value="expe.stats.bodies_explored_count" variant="success">
                        {{expe.stats.bodies_explored_count}} bodies explored / {{expe.stats.bodies_count}}
                        </span>
                        </b-progress-bar>
                    </b-progress>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ExpeditionsApi from '../../API/ExpeditionsApi.js';
    const expeApi = new ExpeditionsApi();
    export default {
        data() {
            return {
                expeditions: [],
                states: {
                    ready: false
                }
            };
        },
        mounted() {
            expeApi.fetchCurrentExpeditions()
                .then(rows => {
                    this.expeditions = rows;
                    this.states.ready = true;
                });
        }
    }
</script>
