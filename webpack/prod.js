const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const config = {
	mode: "production",
	plugins: [
		new UglifyJSPlugin({
			sourceMap: true,
		}), //清除未引用的代码
	],
};

module.exports = config;
