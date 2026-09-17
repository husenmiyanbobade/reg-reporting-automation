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

        stage('Run tests') {
            steps {
                withCredentials([
                    string(credentialsId: 'base-url-qa', variable: 'BASE_URL'),
                    string(credentialsId: 'test-username-qa', variable: 'TEST_USERNAME'),
                    string(credentialsId: 'test-password-qa', variable: 'TEST_PASSWORD')
                ]) {
                    bat 'npx playwright test'
                }
            }
        }
    }
}