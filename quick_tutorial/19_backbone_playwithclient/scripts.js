// # model
var ModelUser = Backbone.Model.extend({
	default : {
		userid : "",
		role : "",
		group : "",
		description : ""
	}
});

// # Collection
var ColectionUser = Backbone.Collection.extend({});

// # Demo
var user1 = new ModelUser({ 
	userid : "BinhLV",
	role : "Developer",
	group : "ATI",
	description : "Lương Văn Bình"
});

var user2 = new ModelUser({ 
	userid : "MinhVK",
	role : "Developer",
	group : "HTV",
	description : "Minh"
});

console.log("Model :" + user1.toJSON());
console.log(user1.toJSON());
var userList = new ColectionUser([user1, user2]);
console.log("Collection :" + userList.toJSON());
console.log(userList.toJSON());

// # Model & View
var ModelView = Backbone.View.extend ({
	model: new ModelUser() ,
	tagName: 'tr',
	events: {
		'click .edit-user' : 'editFunc',
		'click .update-user' : 'updateFunc',
		'click .delete-user' : 'deleteFunc',
		'click .cancel' : 'cacelFunc'
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
	},
	deleteFunc: function() {
		console.log("delete model");
		console.log(this.model.toJSON());
		// userList.remove([this.model]);
		this.model.destroy();

	},
	cacelFunc: function() {
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
				self.changeModel();
			}, 300);
		},this);

		this.model.on('remove', function() {
			self.removeModel();
		}, this); // for delete

		this.render();
	},
	removeModel : function() {
		console.log("Collection.delete ");
		this.render();
	},
	changeModel : function () { 
		console.log("Collection.chage");
		this.render();
	},
	addModel : function () { 
		console.log("Collection.add");
		this.render();
	},
	render: function() {
		var self = this;
		this.$el.html('');
		console.log("Generate User List");
		console.log(this.model.toJSON());
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

		console.log(userObj.toJSON());
		userList.add(userObj);
	});

	$('.reset').on('click', function() {
		$('#input .userid-input').val('');
		$('#input .role-input').val('');
		$('#input .group-input').val('');
		$('#input .description-input').val('');
		collectionView.render();
	});
	
})