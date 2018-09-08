// Copyright (c) 2018, Ahmed and contributors
// For license information, please see license.txt

frappe.ui.form.on('Stake', {
	refresh: function(frm) {

	},
	total_account_balance: function(frm){
		if(frm.doc.total_number_of_stakes > 0){
			frm.set_value("stake_value", frm.doc.total_account_balance/frm.doc.total_number_of_stakes);
		}
		else{
			frappe.throw(__("Please insert positive value of Total Number of Stakes"));
		}
		
	},
	total_number_of_stakes: function(frm){
		if(frm.doc.total_number_of_stakes > 0){
			frm.set_value("stake_value", frm.doc.total_account_balance/frm.doc.total_number_of_stakes);
		}
		else{
			frappe.throw(__("Please insert positive value of Total Number of Stakes"));
		}
	}
});

cur_frm.cscript.stake_value = function(doc, dt, dn){

	$.each(cur_frm.doc.stakeholder_details || [], function(i, v) {
			frappe.model.set_value(v.doctype, v.name, "account_stake_value", cur_frm.doc.stake_value);
		})
}
cur_frm.cscript.account_stake_value = function(doc, dt, dn){
	// doc = locals[dt][dn];
	// frappe.model.set_value(doc.doctype, doc.name, "account_balance", doc.account_stake_value*doc.number_of_stakes);
	$.each(cur_frm.doc.stakeholder_details || [], function(i, v) {
			frappe.model.set_value(v.doctype, v.name, "account_balance", v.account_stake_value*v.number_of_stakes);
		})

},
cur_frm.cscript.validate = function(doc, dt, dn){
	$.each(cur_frm.doc.stakeholder_details || [], function(i, v) {
			frappe.model.set_value(v.doctype, v.name, "account_stake_value", cur_frm.doc.stake_value);
			frappe.model.set_value(v.doctype, v.name, "account_balance", v.account_stake_value*v.number_of_stakes);
		})
	var total_number_of_stakes = 0
	$.each(cur_frm.doc.stakeholder_details || [], function(i, v) {
			total_number_of_stakes+=v.number_of_stakes
		})
	cur_frm.set_value("total_number_of_stakes",total_number_of_stakes)
	// doc = locals[dt][dn];
	// frappe.model.set_value(doc.doctype, doc.name, "account_balance", doc.account_stake_value*doc.number_of_stakes);
}
cur_frm.cscript.number_of_stakes = function(doc, dt, dn){
	var total_number_of_stakes = 0
	$.each(cur_frm.doc.stakeholder_details || [], function(i, v) {
			total_number_of_stakes+=v.number_of_stakes
		})
	cur_frm.set_value("total_number_of_stakes",total_number_of_stakes)
}
frappe.ui.form.on('Stakeholder Detail', {
    stakeholder_details_add: function(frm) {
      // adding a row ... 
   },
   stakeholder_details_remove: function(frm) {
		var total_number_of_stakes = 0
		$.each(cur_frm.doc.stakeholder_details || [], function(i, v) {
				total_number_of_stakes+=v.number_of_stakes
			})
		cur_frm.set_value("total_number_of_stakes",total_number_of_stakes)
		}
});

cur_frm.cscript.account_balance = function(doc, dt, dn){
	var total_account_balance = 0
	$.each(cur_frm.doc.stakeholder_details || [], function(i, v) {
			total_account_balance+=v.account_balance
		})
	if(total_account_balance > doc.total_account_balance){
		frappe.throw(__("The summation of account balances exceed the total account balance"))
	}
}

frappe.call({
	method: 'stakeholder.apiclient.get_stakes',
	callback: function(data) {
		if(data.message){
			$( ".page-content-wrapper" ).append( `<table class="staketable table">
				  <thead>
				    <tr>
				      <th scope="col">Account Owner Number</th>
				      <th scope="col">Number Of Stakes</th>
				      <th scope="col">Stake Value</th>
				      <th scope="col">Account Balance</th>
				    </tr>
				  </thead>
				  <tbody>
				  </tbody>
				</table>` );
			$.each(data.message || [], function(i, v) {
				$(".staketable tbody").append(`<tr><td>${v.account_owner_number}</td>
					<td>${v.number_of_stakes}</td>
					<td>${v.account_stake_value}</td>
					<td>${v.account_balance}</td></tr>`)
			})
		}
	}
});

// frappe.ui.form.on('Stakeholder Detail', {
//     stakeholder_details_add: function(frm) {
//       // adding a row ... 
//    },
//    stakeholder_details_remove: function(frm) {
// 		var total_number_of_stakes = 0
// 		$.each(cur_frm.doc.stakeholder_details || [], function(i, v) {
// 				total_number_of_stakes+=v.number_of_stakes
// 			})
// 		cur_frm.set_value("total_number_of_stakes",total_number_of_stakes)
// 		}
// });

