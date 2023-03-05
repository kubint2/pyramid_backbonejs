Backbone.Model.prototype.idAttribute = '_id';

// # model
var ModelUser = Backbone.Model.extend({
	default : {
		_id : 0,
		userid : "",
		role : "",
		group : "",
		description : ""
	}
});

// # Collection
var ColectionUser = Backbone.Collection.extend({
	url: 'http://localhost:6543/api/users',
	parse: function(response) {
		return response.users;
	  }
});

// # Demo
var userList = new ColectionUser();
// # Model & View
var ModelView = Backbone.View.extend ({
	model: new ModelUser() ,
	tagName: 'tr',
	events: {
		'click .edit-user' : 'editFunc',
		'click .update-user' : 'updateFunc',
		'click .delete-user' : 'deleteFunc',
		'click .cancel' : 'cancelFunc'
	},
	editFunc: function() {
		console.log(this.model.toJSON());
		// console.log(this.$('.userid').html()); // output BinhLV
		this.$('.userid').html('<input class="form-control userid-input" value="'+ this.model.get('userid') +'" />');
		this.$('.role').html('<input class="form-control role-input" value="'+ this.model.get('role') +'" />');
		this.$('.group').html('<input class="form-control group-input" value="'+ this.model.get('group') +'" />');
		this.$('.description').html('<input class="form-control description-input" value="'+ this.model.get('description') +'" />');
		
		this.$('.edit-user').hide();
		this.$('.delete-user').hide();
		this.$('.update-user').show();
		this.$('.cancel').show();
	
	},
	updateFunc: function() {
		this.model.set('userid', this.$('.userid-input').val());
		this.model.set('role', this.$('.role-input').val());
		this.model.set('group', this.$('.group-input').val());
		this.model.set('description', this.$('.description-input').val());

		this.model.save({uid: this.model.get('_id')}, {
			success: function(response) {
				console.log('Successfully UPDATED User with _id: ' + response.toJSON()._id);
				// collectionView.render();
				setTimeout(function() {
					collectionView.render();
				}, 30);
			},
			error: function(err) {
				console.log('Failed to update User!');
			}
		});
	},
	deleteFunc: function() {
		console.log("delete model");
		console.log(this.model.toJSON());
		// userList.remove([this.model]);
		this.model.destroy({
			success: function(response) {
				console.log('Successfully DELETED blog with _id: ' + response.toJSON()._id);
				collectionView.render();
			},
			error: function(err) {
				console.log('Failed to delete blog!');
			}
		});
	},
	cancelFunc: function() {
		collectionView.render();
	},
	initialize : function () {
		this.template = _.template($('.user-template').html());
		return this;
	},
	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});


// # Collect & View
var CollectionView = Backbone.View.extend ({
	model: new ColectionUser() ,
	el: $('.user-list'),
	initialize : function () {
		self = this;
		this.model.on('add', this.addModel, this); //  bind event 'add' of collection to function 'addModel'
		// this.model.on('change', this.updateModel, this); //  bind event 'add' of collection to function 'addModel'
		this.model.on('change', function() {
			setTimeout(function() {
				self.updateModel();
			}, 30);
		},this);

		this.model.on('remove', function() {self.deleteModel()}, this); // for delete

		self.fetchModel();
	},
	fetchModel: function() {
		self = this;
		this.model.fetch({
			success: function(response) {
				_.each(response.toJSON(), function(item) {
					console.log('Successfully GOT blog with _id: ' + item._id);
				})
				self.render();
			},
			error: function() {
				console.log('Failed to get user!');
			}
		});
	},
	deleteModel : function() {
		console.log("Collection.delete");
		// this.render(); TODO
	},
	updateModel : function () { 
		console.log("Collection.update");
		// this.render();
	},
	addModel : function () { 
		console.log("Collection.add");
	},
	render: function() {
		var self = this;
		
		console.log("Generate User List");
		console.log(this.model.toJSON());
		
		this.$el.html('');
		_.each(this.model.toArray(), function(model) {
				self.$el.append((new ModelView({model : model})).render().$el);
			}); 
		
		return this;
	}
});


var collectionView = new CollectionView ({ model: userList  }) ;

$(document).ready(function() {
	$('.add-user').on('click', function() {
		var userObj = new ModelUser({
			userid: $('#input .userid-input').val(),
			role: $('#input .role-input').val(),
			group: $('#input .group-input').val(),
			description: $('#input .description-input').val()
		});
		$('#input .userid-input').val('');
		$('#input .role-input').val('');
		$('#input .group-input').val('');
		$('#input .description-input').val('');

		userList.add(userObj);// console.log(userList.toJSON());

		userObj.save(null, {
			success: function(response) {
				console.log('Successfully SAVED User with _id: ' + response.toJSON()._id);
				userObj.set({'_id': response.toJSON()._id})
				console.log(userObj.toJSON());
				// userList.trigger('fetch');
				collectionView.render();
			},
			error: function() {
				console.log('Failed to save blog!');
				collectionView.fetchModel();// reload collection and render
			}
		});

	});

	$('.reset').on('click', function() {
		$('#input .userid-input').val('');
		$('#input .role-input').val('');
		$('#input .group-input').val('');
		$('#input .description-input').val('');
		collectionView.render();
	});
	
})