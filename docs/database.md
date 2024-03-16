<h1> Database Installation Guide</h1>

- Create an Account on [XataDB](https://xata.io)
- Create a new Database According To Your Region

- After Creating Database Follow These Steps: 

1. Install Xata CLI on Your Device
```bash
npm install -g @xata.io/cli
```
2. Login to Your Account
```bash
xata auth login
```

3. Copy the end Point of the database by clicking on database it will look like this

```bash
 https://xxxx-s-workspace-qurnbs.your-region.sh/db/DB-name:branch-name
 ```
 4. Remove The Branch Name and paste  the end point  in `.xatarc` and `.env` file. Your End Point should be look like this
 ```bash
  https://xxxx-s-workspace-qurnbs.your-region.sh/db/DB-name
  ```

5. Go to Your Account Settings And Create a New API Key and Paste it in  `.env `file.

6. Now Upload Schemas Into Your Database By This Command
```bash
xata schema upload schemas.json

xata codegen
```

 
