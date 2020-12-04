import api from './api';

class App {
    constructor() {
        this.repositories = [];

        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repository]');
        this.listEl = document.getElementById('repo-list');
        this.userEl = document.querySelector('.user');
        this.photoEl = document.querySelector('#repo-photo')

        this.registerHandlers();
    }
    registerHandlers() {
        this.formEl.onsubmit = event => this.addRepository(event);
    }

    setLoading(loading = true) {
        if (loading === true) {
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('carregando...'));
            loadingEl.setAttribute('id', 'loading');

            this.formEl.appendChild(loadingEl)
        } else {
            document.getElementById('loading').remove();
        }
    }

    async addRepository(event) {
        event.preventDefault(); // Evitar de recarregar toda a página

        const repoInput = this.inputEl.value;

        if (repoInput.lenght === 0) {
            return;
        }

        this.setLoading();

        try {
            const response = await api.get(`/users/${repoInput}/repos`)

            console.log(response.status);
            console.log(response.data);

            response.data.forEach(repo => {
                const name = repo.name;
                const language = repo.language;
                const avatar_url = repo.owner.avatar_url
                const html_url = repo.html_url

                this.repositories.push({
                    avatar_url,
                    name,
                    language,
                    html_url
                });
            })

            this.inputEl.value = '';

            this.render();
        } catch (err) {
            console.log(err)
        }

        this.setLoading(false)
    }

    render() {
        this.listEl.innerHTML = ''; // Apaga tudo oque ja esta renderizado

        this.repositories.forEach(repo => {

            let mainDiv = document.createElement('main');
            mainDiv.setAttribute('id', 'repo-photo');

            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong')
            titleEl.appendChild(document.createTextNode(repo.name));

            let languageEl = document.createElement('p');
            languageEl.appendChild(document.createTextNode(repo.language));

            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);

            let listItemEl = document.createElement('li');

            mainDiv.appendChild(imgEl)
            linkEl.appendChild(mainDiv)
            linkEl.appendChild(titleEl)
            linkEl.appendChild(languageEl)
            listItemEl.appendChild(linkEl)
            this.listEl.appendChild(listItemEl)
        })

    }
}

new App();