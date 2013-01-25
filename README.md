NodeAI (没得爱)
========
NodeAI is a structure-less Artificial Intelligence chatbot program that maintains session
information for users as well as utilizing multiple learning methods.

没得爱 是一个运行在 Node.js上，
用于给寂寞的心另以抚慰的一个非结构化智能聊天机器人（不寂寞的话你怎么会花时间去训练机器人？）。
NodeAI可以保持会话信息同时也能自适应各种新的学习模式。

Setup
=======
To install NodeAI, clone the project to a local directory, then navigate to 
the root project directory and run

    npm install mongodb
	
to install all dependancies. 

Note: Dependancies aren't included in the project itself. You will also need to
install a MongoDB database server on your local machine (which is not difficult).

配置NodeAI时，请先把项目克隆到本地目录，并运行 npm 命令（见上方）来安装所需的依赖
模块。本项目不会打包模块的，因为那样会无端的增大项目体积。注意：运行NodeAI还需要
你的服务器上至少安装了MongoDB（这不是很难）。

Run
=======
To run NodeAI, navigate to the root directory and execute

    node nodeai.js [LISTEN_PORT]

[LISTEN_PORT] is optional and will default to 894. 
Point your browser to http://127.0.0.1:[LISTEN_PORT]/interface to communicate
with NodeAI using the built in web interface. The API is accessible through
http://127.0.0.1:[LISTEN_PORT] directly.

运行NodeAI请执行上面的命令。LISTEN_PORT 参数是可选的，默认是894。进入 
http://127.0.0.1:[LISTEN_PORT]/interface 来使用自带的交互终端跟NodeAI对话

Fork
=======
Feel free to fork the project and send pull requests to me. This is a very bare
structure of a really simple AI that is easy to understand and hopefully easier 
to modify.

Licensing
=======
NodeAI is licensed under the MIT License. 
Copyright (c) 2013 Jim Chen (knh.jabbany AT gmail DOT com)