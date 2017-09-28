module.exports.sendRes = function(res, data){
	if (!data){
		res.status(204);
		res.json({
			message: 'No content',
			data: null,
			success: true,
			status: 204
		});
	} else {
		res.status(200);
		res.json({
			data: data,
			success: true,
			status: 200
		});
	}
};