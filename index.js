function mainLogic(allData) {
	function shouldSendMail(item) {
		const {Expiring_On, Difference_In_Days, Lookthrough} = item;
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Normalize today's date

		const expiringDate = new Date(Expiring_On.split('-').reverse().join('-')); // Convert to date format (YYYY-MM-DD)

		let startDate, endDate;
		if (Lookthrough === 'before') {
			startDate = new Date(expiringDate);
			startDate.setDate(expiringDate.getDate() - Difference_In_Days);
			endDate = expiringDate;
		} else if (Lookthrough === 'after') {
			startDate = expiringDate;
			endDate = new Date(expiringDate);
			endDate.setDate(expiringDate.getDate() + Difference_In_Days);
		} else {
			return {error: 'Invalid Lookthrough value'};
		}

		// Check if today is within the range or matches Expiring_On
		const sendMail = today >= startDate && today <= endDate;
		return {sendMail};
	}

	for (const item of allData) {
		const result = shouldSendMail(item);

		item.send_mail = result.sendMail;
	}

	console.log('All Data: ', allData);

	const res = allData.filter((item) => item.send_mail === true && item.Is_Recurring === true);

	console.log('Res:', res);
	return res;
}
