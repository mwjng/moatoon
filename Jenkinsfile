pipeline {
    agent any

    environment {
        EC2_HOST = "i12a401.p.ssafy.io"
        EC2_USER = "ubuntu"
        BACKEND_IMAGE = "mwjng/moa-be:latest"
        JWT_KEY = credentials('JWT_KEY')
        MYSQL_PASSWORD = credentials('MYSQL_PASSWORD')
        MYSQL_USERNAME = credentials('MYSQL_USERNAME')
        OPENVIDU_SECRET = credentials('OPENVIDU_SECRET')
        OPENVIDU_URL = credentials('OPENVIDU_URL')
        REDIS_HOST = credentials('REDIS_HOST')
        REDIS_PORT = credentials('REDIS_PORT')
        SMTP_EMAIL = credentials('SMTP_EMAIL')
        SMTP_PW = credentials('SMTP_PW')
        S3_ACCESS = credentials('S3_ACCESS')
        S3_SECRET = credentials('S3_SECRET')
        S3_BUCKET = credentials('S3_BUCKET')
        S3_REGION = credentials('S3_REGION')
        REACT_APP_OPENAI_API_KEY = credentials('REACT_APP_OPENAI_API_KEY')
        DANGEROUSLY_DISABLE_HOST_CHECK = credentials('DANGEROUSLY_DISABLE_HOST_CHECK')
        REACT_APP_SERVER_URL = credentials('REACT_APP_SERVER_URL')
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository'
                script {
                    git credentialsId: 'Gitlab', url: 'https://lab.ssafy.com/s12-webmobile1-sub1/S12P11A401.git'
                }
            }
        }

        stage('Build Backend & Frontend') {
            parallel {
                stage('Build Backend') {
                    steps {
                        echo 'Build backend'
                        dir('backend/') {
                            sh '''
                            chmod +x gradlew
                            export JWT_KEY=$JWT_KEY
                            export MYSQL_USERNAME=$MYSQL_USERNAME
                            export MYSQL_PASSWORD=$MYSQL_PASSWORD
                            export REDIS_HOST=$REDIS_HOST
                            export REDIS_PORT=$REDIS_PORT
                            export OPENVIDU_SECRET=$OPENVIDU_SECRET
                            export OPENVIDU_URL=$OPENVIDU_URL
                            export SMTP_EMAIL=$SMTP_EMAIL
                            export SMTP_PW=$SMTP_PW
                            export S3_ACCESS=$S3_ACCESS
                            export S3_SECRET=$S3_SECRET
                            export S3_BUCKET=$S3_BUCKET
                            export S3_REGION=$S3_REGION
                            ./gradlew clean build
                            docker build -t $BACKEND_IMAGE .
                            '''
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        echo 'Build frontend'
                        dir('frontend/') {
                            sh 'echo REACT_APP_OPENAI_API_KEY = $REACT_APP_OPENAI_API_KEY > .env'
                            sh 'echo DANGEROUSLY_DISABLE_HOST_CHECK = $DANGEROUSLY_DISABLE_HOST_CHECK >> .env'
                            sh 'echo REACT_APP_SERVER_URL = $REACT_APP_SERVER_URL >> .env'
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Push Backend Image to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                        try {
                            echo 'Login Docker Hub'
                            sh 'echo "$DOCKER_HUB_PASSWORD" | docker login -u "$DOCKER_HUB_USERNAME" --password-stdin'

                            echo 'Push backend image'
                            sh "docker push $BACKEND_IMAGE"

                        } catch (Exception e) {
                            echo 'Docker push failed'
                            currentBuild.result = 'FAILURE'
                        } finally {
                            echo 'Logout from Docker Hub'
                            sh 'docker logout || true'
                        }
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo 'Deploying to EC2'
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: 'EC2_SSH_KEY', keyFileVariable: 'SSH_KEY_PATH')]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_PATH" "$EC2_USER"@"$EC2_HOST" "rm -rf /home/ubuntu/build/*"
                        """

                        sh """
                            scp -r -i "$SSH_KEY_PATH" frontend/build/* "$EC2_USER"@"$EC2_HOST":/home/ubuntu/build/
                        """

                        sh """
                            ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_PATH" "$EC2_USER"@"$EC2_HOST" << EOF
                            docker exec nginx rm -rf /usr/share/nginx/html/*
                            docker cp /home/ubuntu/build/. nginx:/usr/share/nginx/html/
                            docker pull "$BACKEND_IMAGE"
                            docker stop backend || true
                            docker rm backend || true
                            docker run -d --name backend -p 8080:8080 --network ubuntu_moa-network \
                            -e SPRING_PROFILES_ACTIVE=prod \
                            -e JWT_KEY="$JWT_KEY" \
                            -e MYSQL_USERNAME="$MYSQL_USERNAME" \
                            -e MYSQL_PASSWORD="$MYSQL_PASSWORD" \
                            -e REDIS_HOST="$REDIS_HOST" \
                            -e REDIS_PORT="$REDIS_PORT" \
                            -e OPENVIDU_SECRET="$OPENVIDU_SECRET" \
                            -e OPENVIDU_URL="$OPENVIDU_URL" \
                            -e SMTP_EMAIL="$SMTP_EMAIL" \
                            -e SMTP_PW="$SMTP_PW" \
                            -e S3_ACCESS="$S3_ACCESS" \
                            -e S3_SECRET="$S3_SECRET" \
                            -e S3_BUCKET="$S3_BUCKET" \
                            -e S3_REGION="$S3_REGION" "$BACKEND_IMAGE"
                        << EOF
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up unused Docker images'
            sh 'docker image prune -f'
        }
    }
}
