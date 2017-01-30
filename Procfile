web: npm start -- --port=`node -e 'process.stdout.write(process.env.PORT)'` --dbUrl=`node -e 'process.stdout.write(JSON.parse(process.env.VCAP_SERVICES).cloudantNoSQLDB[0].credentials.url + "/")'`
