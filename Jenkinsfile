// created by Husen Miyan Bobade
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/husenmiyanbobade/reg-reporting-automation.git'
            }
        }

        stage('Install dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright browsers') {
            steps {
                 bat 'npx playwright install --with-deps'
             }
        }

        stage('Run tests') {
            steps {
                withCredentials([
                    string(credentialsId: 'base-url-qa', variable: 'BASE_URL'),
                    string(credentialsId: 'test-username-qa', variable: 'TEST_USERNAME'),
                    string(credentialsId: 'test-password-qa', variable: 'TEST_PASSWORD'),
                    string(credentialsId: 'db-server-qa', variable: 'DB_SERVER'),
                    string(credentialsId: 'db-port-qa', variable: 'DB_PORT'),
                    string(credentialsId: 'db-name-qa', variable: 'DB_NAME'),
                    string(credentialsId: 'db-user-qa', variable: 'DB_USER'),
                    string(credentialsId: 'db-password-qa', variable: 'DB_PASSWORD')
                ]) {
                    bat script: 'npx playwright test', returnStatus: true
                }
            }
        }

        stage('Publish results') {
            steps {
                junit 'test-results/results.xml'
                archiveArtifacts artifacts: 'playwright-report/**, test-results/**', allowEmptyArchive: true
            }
        }
    }
}