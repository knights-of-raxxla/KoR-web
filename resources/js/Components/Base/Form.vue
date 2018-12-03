<script>
    export default {
        methods: {
            all_fields_filled(keys) {
                let valid = true;
                for (let key of keys) {
                    let val = this.form[key];
                    if (!val || !val.length) {
                        valid = false;
                        let err = `please set the field ${key}`;
                        this.states.errors.push(err);
                    }
                }
                return valid;
            },
        }
    }
</script>
