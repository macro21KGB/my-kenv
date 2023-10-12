// Name: Manage Water Reminder
// Schedule: 0 * * * *
// Cache: true


import "@johnlindquist/kit"

const waterReminderDb = await db("water-reminder", {
    isOn: true,
})



if (flag?.trigger === "schedule") {

    if (waterReminderDb.isOn) {
        notify("Drink some Water!!!")
    }
} else {

    const waterReminderValue = await arg(`Do you want to turn on/off (currently ${waterReminderDb.isOn ? 'on' : 'off'})?`,
        [
            {
                name: "Turn On",
                value: true,
            },
            {
                name: "Turn Off",
                value: false,
            }
        ])


    waterReminderDb.isOn = waterReminderValue
    waterReminderDb.write()
}
