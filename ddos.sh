# for((i = 0; i < 1000; i++)); do
#  curl -s -L -X POST "localhost:5000/api/users/register" \
# -H "access-device: super new " \
# -H "user-token: zip" \
# -H "Content-Type: application/json" \
# --data-raw "{
#    \"username\" : \"tddssd${i}\",
#    \"password\" : \"123123\",
#    \"fullName\" : \"Trần Hiệp\",
#    \"age\" : 9,
#    \"address\" : \"Gia Kiệm\",
#    \"phoneNumber\" : \"0987564211\",
#    \"email\" : \"trani${i}\"
# }" \
# --compressed & 
#   done

for((i = 0; i < 2000; i++)); do
curl -s -L -X POST "localhost:5000/api/medicine/add" \
-H "access-device: 123123" \
-H "user-token: 123123" \
-H "Content-Type: application/json" \
--data-raw "{
    \"name\":\"ss${i}\",
    \"typeMedicineIds\":\"headed\",
    \"entryPrice\": 100000,
    \"unit\": 1000
}" \
--compressed & 
  done