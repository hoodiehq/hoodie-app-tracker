web: npm start -- --port=$VCAP_APP_PORT --dbUrl=`node -e 'process.stdout.write(JSON.parse(process.env.VCAP_SERVICES).cloudantNoSQLDB[0].credentials.url + "/")'`
