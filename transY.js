//Y:

var A=[0,y+h/2], B=[x,y+h/2];

var arr=[A[1]-B[1],B[0]-A[0],A[0]*B[1]-A[1]*B[0]]

mtrx=[Math.pow(arr[1],2)-Math.pow(arr[0],2),   -2*arr[0]*arr[1] ,-2*arr[0]*arr[1],Math.pow(arr[0],2)-Math.pow(arr[1],
    2) ,-2*arr[0]*arr[2],-2*arr[1]*arr[2]]
mtrx.map((v)=>v/(Math.pow(arr[0],2)+Math.pow(arr[01],2)))

//X:

var A=[x+w/2,0], B=[x+w/2,y];

var arr=[A[1]-B[1],B[0]-A[0],A[0]*B[1]-A[1]*B[0]]

mtrx=[Math.pow(arr[1],2)-Math.pow(arr[0],2),   -2*arr[0]*arr[1] ,-2*arr[0]*arr[1],Math.pow(arr[0],2)-Math.pow(arr[1],2) ,-2*arr[0]*arr[2],-2*arr[1]*arr[2]]

mtrx.map((v)=>v/(Math.pow(arr[0],2)+Math.pow(arr[01],2)))
