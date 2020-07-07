<template>
    <div>
        <div class="card">
            <h1>INT Titans Magic Blocks</h1>
            <p>Current block height : {{ data.height }}</p>
            <p>Next Magic Block : {{ data.nextMB }} </p>
            <p>Average BlockTime : {{ data.aBT/1000 }}s</p>
            <p>Approx. date of next Magic Block : </p>
            <h3>{{ dateMB }}</h3>
            <h3>{{ Htsp }}h {{ Mtsp }}m {{ Stsp }}s</h3>
            <p class="center 3top"><a class="btn" @click="setvalues()">Refresh</a>
            </p>
        </div>
        <p class="center">Auto-refresh : every 30s</p>
        <p class="center">Please go to <a href="https://golgoth.duckdns.org?t=X">https://golgoth.duckdns.org?t=X</a> to modify the refresh rate (X in seconds).</p>
    </div>
</template>

<script>
    //const hostLol = 'http://localhost:3000'
    const hostLol = 'https://golgoth.duckdns.org'
export default {
    async asyncData({ $axios }) {
        let data = await $axios.$get(hostLol + "/api/dateNextMB")
        let timestamp = Math.round(data.msRemaining / 1000)
        let dateMB = new Date(data.msRemaining + Date.now())
        let refresh = null
        dateMB = dateMB.toLocaleString('en-GB', {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short"})
        return { data, dateMB, timestamp, refresh }
    },
    mounted() {
        this.refresh = this.$nuxt.$route.query.t || 30
        setInterval(() => this.timestamp--, 1000) //ToDo: ajouter CORS au serveur
        setInterval(async function() { this.setvalues() }.bind(this), this.refresh*1000)
    },
    methods: {
        setvalues: async function() {
            this.data = await this.$axios.$get(hostLol + "/api/dateNextMB")
            this.timestamp = Math.round(this.data.msRemaining / 1000)
            this.dateMB = new Date(this.data.msRemaining + Date.now())
            this.dateMB = this.dateMB.toLocaleString('en-GB', {weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short"})
        },
        getNow: function() {
            const today = new Date(Date.now() + this.timestamp);
            const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            const dateTime = date +' '+ time;
            //this.timestamp = Date.now();
        }
    },
    computed: {
        Stsp: function() {
            return (this.timestamp % 60)
        },
        Mtsp: function() {
            return ((this.timestamp - this.Stsp)/60)%60
        },
        Htsp: function() {
            return (this.timestamp - this.Stsp - this.Mtsp*60)/3600
        }
    }
}
</script>

<style>
    * {
        font-family: "Trebuchet MS";
    }

    @media (max-width: 779px) {
        div.card {
            width: 80%;
        }
    }
    @media (min-width: 780px) {
        div.card {
            max-width: 500px;
        }
    }
        div.card {
        margin: 2rem auto;
        border: 1px solid darkgrey;
        border-radius: 16px;
        padding: 1rem;
        box-shadow: 4px 4px 4px lightgrey;
    }
    button {
        display: block;
        margin: auto;
    }
    .btn {
        background-color: #e60014;
        color: #fff;
        padding: 1rem;
        cursor: pointer;
        border-radius: 5px;
    }
    .btn:hover {
        background-color: #ec0011;
        box-shadow: 4px 4px 4px lightgrey;
    }
    .center {
        text-align: center;
    }
    .3top {
          padding-top: 3rem;
      }
    h3 {
        text-align: center;
    }
</style>