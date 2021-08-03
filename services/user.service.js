const DbMixin = require("../mixins/db.mixin");
const Moleculer = require("moleculer");
module.exports = {
	name: "user",
	mixins: [DbMixin("user")],
	settings: {
		fields: ["username", "password"],
	},
	actions: {
		register: {
			params: {
				username: {type: "string", required: true, min: 4, max: 20},
				password: {type: "string", required: true, min: 6, max: 20},
			},
			handler(ctx) {
				const userEntity = {
					username: ctx.params.username,
					password: ctx.params.password,
				};
				console.log(this.adapter);
				return this.adapter.findOne({username: ctx.params.username})
					.then(existedUser => {
						if (existedUser) {
							throw new Moleculer.Errors.MoleculerClientError("Username duplicated.");
						}
						return this.adapter.insert(userEntity);
					})
					.then(doc => {
						this.entityChanged("created", doc, ctx);
						return {};
					});
			},
			login: {
				params: {
					username: {type: "string", required: true, min: 4, max: 20},
					password: {type: "string", required: true, min: 6, max: 20},
				},
				handler: (ctx) => {
					const userEntity = {
						username: ctx.params.username,
						password: ctx.params.password,
					};
					return this.adapter.findOne({username: ctx.params.username})
						.then(existedUser => {
							if (!existedUser) {
								throw new Moleculer.Errors.MoleculerClientError("Username not found.");
							}

						});
				}
			}
		}
	}
};
