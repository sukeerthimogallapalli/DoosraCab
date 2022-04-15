/*driverTable - to save driver info and availability of driver
riderTable - to save rider info 
assignedDrivers- to save assigned diver and rider info
*/

//Driver registration
const registerDriver = (req, res) => {
  const driverInfo = {
    name: "Driver 1",
    carName: "SUV",
    exp: 3,
    available: true,
    email: "driver@gmail.com",
    password: "driver@123", //should be convert the password to hash before saving it in db
    isEmailVerified: true,
    isMobileVerified: true,
    lat: "1.8237y487y2",
    lon: "0.98237824y7",
  };
  const data = new driverInfo();
  driverTable
    .save(data)
    .then((info) => {
      res.JSON({ status: 201, message: "Driver registered successfully." });
    })
    .catch((err) =>
      res.JSON({ status: 400, message: "Failed to register driver" })
    );
};
const registerRider = (req, res) => {
  const riderInfo = {
    name: "Rider 1",
    email: "rider@gmail.com",
    password: "rider@123",
    isEmailVerified: true,
    isMobileVerified: true,
  };
  const data = new riderInfo();
  riderTable
    .save(data)
    .then((info) => {
      res.JSON({ status: 201, message: "Rider registered successfully." });
    })
    .catch((err) =>
      res.JSON({ status: 400, message: "Failed to register rider" })
    );
};

/**
 * req:{riderLat:8.9824747865,riderLon:"3.8274y5872468"}
 */
const findNearByDrivers = (req, res) => {
  // need to get from and to places then calculate the distnce and assign driver
  //Taking some random value as threshHold
  const threshHold = 2.2489824;
  const reqBody = req.body;
  driverTable.find({ available: true }).then((info) => {
    if (info.length) {
      const distanceBetween = Math.sqrt(
        (info[0].lat - info[0].lon) * (info[0].lat - info[0].lon) +
          (reqBody.lat - reqBody.lon) * (reqBody.lat - reqBody.lon)
      );
      if (distanceBetween <= threshHold) {
        res.JSON({
          status: 200,
          message: "Available cabs near by",
          data: info,
        });
      } else {
        res.JSON({ status: 402, message: "Cabs are not available" });
      }
    } else {
      res.JSON({ status: 402, message: "Cabs are not available" });
    }
  });
};

/**
 * req:{riderLat:8.9824747865,riderLon:"3.8274y5872468"}
 */
const bookCab = (req, res) => {
  //Retrieving available drivers
  driverTable.find({ available: true }).then((info) => {
    //if drivers are available then calculating distance
    if (info.length) {
      const distanceBetween = Math.sqrt(
        (info[0].lat - info[0].lon) * (info[0].lat - info[0].lon) +
          (reqBody.lat - reqBody.lon) * (reqBody.lat - reqBody.lon)
      );
      if (distanceBetween <= threshHold) {
        //if distance is lessthan the threshHold value then assigning driver to the rider by mapping ids
        const assignedDrivers = {
          driverId: info[0].id,
          riderId: req.decode.driverId,
        };
        const data = new driverRiderData();
        assignedDrivers
          .save(data)
          .then((info) => {
            if (info.affectedRows) {
              return info;
            }
          })
          .then((info) => {
            return driverTable.update(
              { id: info[0].id },
              { $set: { available: false } }
            );
          })
          .then((info) => {
            if (info) res.JSON({ status: 200, message: "Cab booked! " });
            else throw err;
          })
          .catch((e) => {
            res.JSON({ status: 400, message: error.message });
          });
      }
    }
  });
};

//updating driver status to available / unavailable
const updateDriverAvailability = (req, res) => {
  const reqBody = req.body;
  driverTable
    .update({ id: reqBody.id }, { $set: { available: reqBody.status } })
    .then((info) => {
      if (info.affectedRows) {
        res.JSON({
          status: 201,
          message: "Availability mode updated successfully",
        });
      } else {
        throw new Error("UPDATE_FAILED");
      }
    })
    .catch((err) => {
      res.JSON({ status: 400, message: err.message });
    });
};