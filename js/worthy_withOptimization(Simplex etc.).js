(function ($) {
    $(document).ready(function () {
        // Animations
        //-----------------------------------------------
        if (($("[data-animation-effect]").length > 0) && !Modernizr.touch) {
            $("[data-animation-effect]").each(function () {
                var $this = $(this),
				animationEffect = $this.attr("data-animation-effect");
                if (Modernizr.mq('only all and (min-width: 768px)') && Modernizr.csstransitions) {
                    $this.appear(function () {
                        setTimeout(function () {
                            $this.addClass('animated object-visible ' + animationEffect);
                        }, 400);
                    }, { accX: 0, accY: -130 });
                } else {
                    $this.addClass('object-visible');
                }
            });
        };
        // Isotope filters
        //-----------------------------------------------
        if ($('.isotope-container').length > 0) {
            $(window).load(function () {
                $('.isotope-container').fadeIn();
                var $container = $('.isotope-container').isotope({
                    itemSelector: '.isotope-item',
                    layoutMode: 'masonry',
                    transitionDuration: '0.6s',
                    filter: "*"
                });
                // filter items on button click
                $('.filters').on('click', 'ul.nav li a', function () {
                    var filterValue = $(this).attr('data-filter');
                    $(".filters").find("li.active").removeClass("active");
                    $(this).parent().addClass("active");
                    $container.isotope({ filter: filterValue });
                    return false;
                });
            });
        };

        //Modal
        //-----------------------------------------------
        if ($(".modal").length > 0) {
            $(".modal").each(function () {
                $(".modal").prependTo("body");
            });
        }
        
        // Solver (optimization)
        $(".test_123").click(function(){
      		
      		/*
      		var cars = [1,2,3];
      		for(i=0;i<cars.length;i++){
      			$(this).append(cars[i]);
      		}
        	$(this).append("This is the result.");
        	*/
        	
        	// Dual simplex algorithm:
        	/* 
        	
        	//var A = [1,1,1];	// constraints A x = b, x>=0
        	//var b = [1];
        	//var c = [1,-1,1];		// cost vector c^T x
        	
        	//var i_B=[2];		// indices basis
        	
        	/*
        	var A = [-1,-2,1,0,
        			-1,0,0,1];
        	var b = [-2,-1];
        	var c = [1,1,0,0];
        	var i_B = [2,3];
        	*/
        	
        	var n_var = 9*9*9;
        	var n_slack = 3*9*9; 	// TODO
        	
        	var A=[];		// constraints A x = b, x>=0
        	var b = [];
        	var c = [];		// cost vector c^T x
        	var i_B = [];			// indices basis (starting with 0)
        	
        	// Variable: x_ijk (i for row, j for column, k for number)
        	// sum_k(x_ijk) = 1 for all i,j
        	var i_constr;
        	var i_var;
        	for(i=0;i<9;i++){
        		for(j=0;j<9;j++){
        			i_constr = 9*i+j;
        			A.push([]);
        			for(k=0;k<n_var;k++){
        				A[i_constr][k] = 0;
        			}
        			
        			b[i_constr] = 1;
        			
        			i_var = 9*9*i+9*j;
        			for(k=0;k<9;k++){	
        				A[i_constr][i_var+k] = 1;	
        			}
        		}        		
        	}
        	// sum_i(x_ijk) = 1 for all k,j
        	var n_constr = A.length;
        	for(k=0;k<9;k++){
        		for(j=0;j<9;j++){
        			i_constr = 9*k+j;
        			A.push([]);
        			for(i=0;i<n_var;i++){
        				A[n_constr+i_constr][i] = 0;
        			}
        			
        			b[n_constr+i_constr] = 1;
        			
        			i_var = 9*j + k;
        			for(i=0;i<9;i++){	
        				A[n_constr+i_constr][i_var+9*9*i] = 1;	
        			}
        		}        		
        	}
        	// sum_j(x_ijk) = 1 for all k,i
        	n_constr = A.length;
        	for(k=0;k<9;k++){
        		for(i=0;i<9;i++){
        			i_constr = 9*k+i;
        			A.push([]);
        			for(j=0;j<n_var;j++){
        				A[n_constr+i_constr][j] = 0;
        			}
        			
        			b[n_constr+i_constr] = 1;
        			
        			i_var = 9*9*i + k;
        			for(j=0;j<9;j++){	
        				A[n_constr+i_constr][i_var+9*j] = 1;	
        			}
        		}        		
        	}
        	// Constraints for all given numbers in the Sudoku:
        	var row_vec = [1];			// starting with 1
        	var column_vec = [1];		// starting with 1
        	var number_vec = [1];
        	
        	for(givenNum=0;givenNum<row_vec.length;givenNum++){
        		var row=row_vec[givenNum];			
	        	var column=column_vec[givenNum];		
	        	var number=number_vec[givenNum];
	        	n_constr = A.length;
	        	for(k=0;k<9;k++){
	        		A.push([]);
	        		for(i=0;i<n_var;i++){
	        			A[n_constr+k][i] = 0;
	        		}
	        		A[n_constr+k][9*9*(row-1)+9*(column-1)+k] = 1;
	        		if(k==number-1){
	        			b[n_constr+k] = 1;
	        		} else {
	        			b[n_constr+k] = 0;
	        		}
	        	}
	        }      	
	        
	        // Create cost vector c:
	        //...
	        var c = [];
	        var x_sol = []; 
	        var i_original2simplexTableau = [];
	        for(i=0;i<n_var;i++){
	        	c[i] = 1;
	        	x_sol = -1;
	        	i_original2simplexTableau[i] = i;
	        }
	        
	        // Create basis indices vector:
	        for(i=0;i<n_constr;i++){
	        	i_B[i] = -1;
	        }
	        
	        $(this).append("ttt");
	        
	        // Preprocess data (eliminate variables that are known):
			/* Example preprocessing data:
	        var AA = [[1,0,1,0],[1,0,0,0],[0,1,0,1]];
	        var bb = [1,0.4,2];
	        var cc = [0,1,0,1];
	        var ii_B = [-1,-1,1];
	        var x_sol = [-1,-1,-1,-1];
	        var ii_original2simplexTableau = [0,1,2,3];
	        var n_var = cc.length;
	        var n_constr = bb.length;
	        */
	        var FLAG = $(this).Preprocess(A,b,c,i_B,n_var,n_constr,x_sol,i_original2simplexTableau);
        	n_var = c.length;
        	n_constr = b.length;
			if(!FLAG){
				$(this).append("Problem infeasible!<br>");
			} else {
				/*
	        	for(i=0;i<x_sol.length;i++){
	        		$(this).append(x_sol[i]);
	        	}
	        	$(this).append("<br>");
	        	for(i=0;i<AA.length;i++){
	        		$(this).append(AA[i]);
	        	}
	        	$(this).append("<br>");
	        	for(i=0;i<bb.length;i++){
	        		$(this).append(bb[i]);
	        	}
	        	$(this).append("<br>");
	        	for(i=0;i<cc.length;i++){
	        		$(this).append(cc[i]);
	        	}
	        	$(this).append("<br>");
	        	for(i=0;i<ii_B.length;i++){
	        		$(this).append(ii_B[i]);
	        	}
	        	$(this).append("<br>");
	        	$(this).append(nn_var);
	        	$(this).append("<br>");
	        	$(this).append(nn_constr);
	        	$(this).append("<br>");
	        	
	        	for(i=0;i<ii_original2simplexTableau.length;i++){
	        		$(this).append(ii_original2simplexTableau[i]);
	        	}
		        */
		       
	        	//$(this).Simplex(A,b,c,i_B);
	        	
	        	var length = 10;
	        	var a = $(this).CreateArrayOfZeros(length);
	        	$(this).append("blajb");
	        	$(this).append("<br>");        	
	        	$(this).append("<br>");
	        	for(i=0;i<a.length;i++){
	        		$(this).append(a[i]);
	        	}	     	
      		
      		}
        });
	
		// Preprocess:
		// Eliminate variables that are known! (i.e. for which there is only one entry that is nonzero in A)
       	// --> do this recursively till no more variables can be elimated.
        // keep track which variable is still in the simplex tableau by keeping an array of indices
        $.fn.Preprocess = function(A,b,c,i_B,n_var,n_constr,x_sol,i_original2simplexTableau) {
        	
        	// Find how many entries for each row are nonzero
        	var nonzeroEntries = [];		// nonzeroEntries[0] = number of nonzero entries of row 0
        	var nonzeroVariable = [];
        	for(i=0;i<n_constr;i++) {
        		nonzeroEntries[i] = 0;
        		for(j=0;j<n_var;j++){
        			if(A[i][j]!=0){
        				nonzeroEntries[i]++;
        				nonzeroVariable[i] = j;
        			}
        		}
        		if(nonzeroEntries[i] == 0) {
        			// error!
        		}
        	}
        	$(this).append("jakf");
        	// Find if one row has only one nonzero entry (all other 0):
        	var problemChanged = true;
	    	while(problemChanged) {
		    	problemChanged = false;
		    	for(i=0;i<n_constr;i++) {
		    		if(nonzeroEntries[i] == 1) {
		    			
		    			index_nonzeroVariable = nonzeroVariable[i];
		    			
		    			// Save solution for the variable (value)
		    			if(x_sol[index_nonzeroVariable]== -1){
		    				x_sol[index_nonzeroVariable] = b[i]/A[i][index_nonzeroVariable];
		    			} else if( Math.abs(x_sol[index_nonzeroVariable]-b[i]/A[i][index_nonzeroVariable])>1e-4 ) {	// 1e-4: tolerance
		    				// problem infeasible
		    				return false;
		    			}
		    			
		    			// Delete column corresponding to the variable
		    			for(j=0;j<n_constr;j++){
		    				if( (nonzeroEntries[j]==1) && ( Math.abs(b[j]/A[j][index_nonzeroVariable] - b[i]/A[i][index_nonzeroVariable] ) >1e-4) ){
		    					// problem infeasible
		    					return false;
		    				}
		    				if(A[j][index_nonzeroVariable] !=0){
		    					nonzeroEntries[j]--;
		    					b[j] -= A[j][index_nonzeroVariable]*x_sol[index_nonzeroVariable];
		    				}
		    				A[j].splice(index_nonzeroVariable,1);
		    			}
		    			c.splice(index_nonzeroVariable,1);
		    			
		    			// Delete constraint row:
		    			A.splice(i,1);		
		    			b.splice(i,1);
		    			i_B.splice(i,1);
		    			
		    			// Keep track of indices in tableau
		    			for(j=0;j<i_original2simplexTableau.length;j++){
		    				if(nonzeroEntries[i] < i_original2simplexTableau[j]){
		    					i_original2simplexTableau[j]--;
		    				} else if(nonzeroEntries[i]==i_original2simplexTableau[j]) {
		    					i_original2simplexTableau[j] = -1;
		    				}
		    			}
		    			for(j=0;j<nonzeroVariable.length;j++){
		    				if(nonzeroEntries[i] < nonzeroVariable[j]){
		    					nonzeroVariable[j]--;
		    				}
		    			}
		    			
		    			// Update:
		    			n_constr--;
		    			n_var--;    
		    			problemChanged = true;  
		    			nonzeroVariable.splice(i,1);
		    			nonzeroEntries.splice(i,1);			
		    		}
		    	}    	
        	}
     		return true;
        };
        	
        // Simplex algorithm:
        $.fn.Simplex = function(A,b,c,i_B) {
        	        	
        	var n_constr = b.length;		// number of constraints
        	var n_var = c.length;			// number of variables
        	// checks: TODO
        	// A.length == n_var*n_constraints
        	// x0.length == c.length
        	// r>=0
        	
        	// Preprocess data:
        	var x_sol = [];
        	var i_original2simplexTableau = [];
        	for(i=0;i<n_var;i++){
        		x_sol[i] = -1;		// use -1 to indicate that no value was assigned yet
        		i_original2simplexTableau[i] = i;
        	}
        	//$(this).Preprocess(A,b,c,i_B,n_var,n_constr,x_sol,i_original2simplexTableau);
        	// x_sol: vector with all values for the variables
        	// i_original2simplexTableau = original index to simplex index (-1 if not in simplex tableau);
        	
        	// Initialize:
        	var c_B = [];
        	for (i = 0; i < n_constr; i++){
        		c_B[i] = c[i_B[i]];
        	}
        	var r = [];		// reduced costs: r^T = c^T - c_B^T B^{-1} A
        	// Initial tableau: (assuming B = I)
        	// 		 | - c_B^T b , c^T - c_B^T A	|
        	//  	 | b 		 , A	|
        	var simplexTableau = [[]]; 
        	
        	simplexTableau[0][0] = 0;
        	
        	for (i = 0; i < n_constr; i++){
        		simplexTableau[0][0] -= c_B[i]*b[i];
        	}
        	for (j = 0; j < n_var; j++) {
        		r[j] = c[j];        		
        		for (i = 0; i < n_constr; i++){
        			r[j] -= c_B[i]*A[i][j];
        		}    	
        		simplexTableau[0][j+1] = r[j];
        	}
        	
        	
        	//var aaa = [[1,2],[3,4],[4,3]];
        	//$(this).append(aaa.length);
        	//$(this).append(aaa[0].length);
        	//aaa[0].push(1);
        	//$(this).append(aaa[0].length);
        	
        	
    		for (j=0; j<n_constr;j++){
    			simplexTableau.push([]);		// create new column
        		simplexTableau[j+1][0] = b[j];
        		for(i = 0; i<n_var; i++) {
        			simplexTableau[j+1][1 + i] = A[j][i];
        		}
        	} 

			// Print tableau:
      		for(i=0;i<n_constr+1;i++){
      			for(j=0;j<n_var+1;j++){
      				$(this).append(simplexTableau[i][j]);
      				$(this).append(" ");
      			}
      			$(this).append("<br>");		
      		}  
      		$(this).append("<br>");
   		
   			// Apply simplex:
      		var maxiter = 10;
      		for (iter = 0; iter < maxiter; iter++) {
	      		//var FLAG = $(this).PrimalSimplexStep(simplexTableau,n_var,n_constr,i_B); 
	      		var FLAG = $(this).DualSimplexStep(simplexTableau,n_var,n_constr,i_B);
	      		if(FLAG == false) {
	      			$(this).append("Cost unbounded");
	      			break;
	      		}
	      		if(FLAG) {
	      			$(this).append("Optimal solution found");
	      			break;
	      		}
	      		// Print tableau:
	      		for(i=0;i<n_constr+1;i++){
	      			for(j=0;j<n_var+1;j++){
	      				$(this).append(simplexTableau[i][j]);
	      				$(this).append(" ");
	      			}
	      			$(this).append("<br>");		
	      		}  
	      		$(this).append("<br>");
      		}
      		
      		// Print:
      		$(this).append("<br>");
      		for(i = 0; i < n_constr; i++){

      			$(this).append("x");
      			$(this).append(i_B[i]);
      			$(this).append("=");
      			$(this).append(simplexTableau[i+1][0]);
      			$(this).append(", ");
      		}
      		$(this).append("Rest of xi=0");
      		$(this).append("Objective value=");
      		$(this).append(-simplexTableau[0][0]);   
        };
        
        $.fn.BranchAndBound = function(simplexTableau,n_var,n_constr,i_B) {
        	// Upper bound (usually infinity, here though 0 because otherwise problem infeasible):
        	var U = 0;
        	
        	// Find variable that is not an integer
        	var xi;
        	var index;
        	for(i=0;i<n_constr;i++) {
        		xi = simplexTableau[(i+1)*(n_var+1)];
        		if(Math.abs(xi-Math.round(xi)) > 1e-4) {		// 1e-5: tolerance for error
        			index = i;
        		}        		
        	}
        	// Done when all integer 
        	if(index == undefined){
        		return true;
        	}
        	
        	// Add constraints (create two subproblems)
        	// Subproblem 1 (xi<floor(xi)):
        	n_constr = simplexTableau.length;
        	simplexTableau[n_constr+1][0] = Math.floor(xi);
        	for(i=0;i<n_var;i++){
        		simplexTableau[n_constr+1][i] = 0;
        	}
        	simplexTableau[n_constr+1][i_B[index]] = 1;
        	i_B[n_constr+1] = i;
        	
        	// Subproblem 2 ():
        	n_constr = simplexTableau.length;
        	simplexTableau[n_constr+1][0] = -Math.ceil(xi);
        	for(i=0;i<n_var;i++){
        		simplexTableau[n_constr+1][i] = 0;
        	}
        	simplexTableau[n_constr+1][i_B[index]] = -1;
        	i_B[n_constr+1] = i;
        	// (instead of creating two subproblems like this, eliminate variables from 
        	//	simplexTableau --> create two subproblems like this)
        	// No, firstly 2 subproblems must be formed and solved before variable can be eliminated to keep feasibility...
        	/*
        	var x_sol;
        	var BAB = [{
        		'tableau':simplexTableau,
        		'solution':x_xol,
        		'basis_indices':i_B,
        		'level':0,
        		'branch':0
        	}];
        	BAB[2] = {
        		'tableau':simplexTableau,
        		'solution':x_xol,
        		'basis_indices':i_B,
        		'level':0,
        		'branch':0
        	};
      	*/
        };	
        
        $.fn.RemoveKnownVariable = function(simplexTableau,x_sol,n_var,n_constr,i_B,i_original2simplexTableau) {
        	var n_tot = i_original2simplexTableau.length;
        	var n_var_per_constr = [];
        	var tol = 1e-4;
        	// Find how many variables are in each constraints
        	for( i = 1; i < n_constr+1; i++) {
        		n_var_per_constr[i-1] = 0;
        		for( j = 1; j<n_var+1; j++){
        			if( (simplexTableau[i][j]>tol)||(simplexTableau[i][j]<-tol) ){
        				n_var_per_constr[i-1] += 1;
        			}	
        		}
        	}
        	var FLAG = true;	// flag if changes have been done
        	var xi; 			// value of the variable
        	var i_nonzero;
        	while(FLAG){
        		FLAG = false;
	        	// Eliminate constraints for which only 1 variable is not 0 and save variable 
	        	for( i = 0; i < n_constr; i++){
	        		if(n_var_per_constr[i]==1){
	        			// find which variable is not 0
	        			for(j=0;j<n_var;j++){
	        				if( (simplexTableau[i+1][j+1]>tol)||(simplexTableau[i+1][j+1]<-tol) ){
	        					i_nonzero = j;
	        					break;
	        				}
	        			}
	        			xi = simplexTableau[i_nonzero+1][0];
	        			for(j=0;j<n_tot;j++){
	        				if(i_original2simplexTableau[j] == i_nonzero){
	        					// TODO check if x_sol[j] is already in there (i.e. if x_sol[j]!=-1). Otherwise needs to check if solutions are the same.Else infeasible
	        					x_sol[j] = xi;
	        				}
	        			}
	        			// check that this variable is not in the basis anymore:
	        			for(j=0;j<n_var;j++){
	        				if( (i_B[j] == i_nonzero)&&(j != i) ){
	        					// Check if this constraint has only this variable too:
	        					if(n_var_per_constr[j]==1){
	        						// TODO: check if value is the same (for constraint i and j), else: infeasible
	        						// TODO: eliminate the constraint j!
	        						n_constr -= 1;
	        					} else {
	        						// Problem!!! Should not be the case!
	        					}
	        				}
	        			}
	        			// Eliminate variable (eliminate column + update first column accordingly):
	        			for(j=0;j<n_constr;j++){
	        				simplexTableau[j+1][0] -= xi*simplexTableau[j+1][i_nonzero+1];
	        			}
	        			// TODO eliminate column
	        			// Update i_B and i_original2simplexTableau
	        			
	        			// Update the number of variables in the constraints
	        			
	        			// Update n_var and n_constr
	        			n_var--;
	        			n_constr--;
	        			FLAG = true;
	        			break;
	        		}
	        	}
	        	
    			// Eliminate unnecessary variables (those that do not exist anymore)
	        	
        	}
        };
        $.fn.PrimalSimplexStep = function(simplexTableau,n_var,n_constr,i_B) {
        	// Step...  
      		// check if solution already feasible --> x optimal (STOP)
      		var j;
      		for(i = 0; i < n_var; i++){
      			if( simplexTableau[0][i+1] < 0 ) {
      				j = i;
      				break;
      			}
      		}
      		
      		if(j == undefined){
      			// Done (optimal solution found)
      			return true;
      		}  	
      		
        	 // j-th column u = (u1,...,un). Find min_{u_i>0}( x_B(i)/u_i)
        	 var l;
        	 var u_i;
        	 var u_i_min;
        	 var theta;
        	 var theta_min = Infinity;
        	 for(i = 0; i < n_constr; i++) {
        	 	u_i = simplexTableau[i+1][1+j];
        	 	if( u_i > 0){
        	 		theta = simplexTableau[i+1][0]/u_i;		// TODO adapt to new 2d-array from here onwards!:
        	 		if( theta < theta_min ){
        	 			theta_min = theta;
        	 			l = i;
        	 			u_i_min = u_i;
        	 		}	
        	 	}
        	 }
        	 if(l == undefined){
        	 	return false; // cost unbounded
        	 }
        	 // Add mutiple of lth row to all other rows and scale lth row, s.t. 
        	 // (j+1)th column of simplex-tableau u -> e_j
        	 var factor;
        	 var testtest;
        	 for (i = 0 ; i < n_constr + 1; i++){
        	 	if ( i != l + 1 ){
        	 		factor = simplexTableau[i][1 + j]/u_i_min;
        	 		for ( k = 0; k < n_var+1; k++) {
        	 		 	simplexTableau[i][k] -= factor*simplexTableau[l+1][k]; 
        	 		}
        	 	}
        	 }
        	 // Scale lth row:
        	 for ( k = 0; k < n_var+1; k++) {
        	 	simplexTableau[l+1][k] /= u_i_min;
        	 }
        	 // Update basis indices with l and j:
        	 i_B[l] = j;
        	
        };
        $.fn.DualSimplexStep = function(simplexTableau,n_var,n_constr,i_B) {
        	              		
      		// Step...  
      		// check if solution already feasible --> x optimal (STOP)
      		var l;
      		for(i = 0; i < n_constr; i++){
      			if( simplexTableau[i+1][0] < 0 ) {
      				l = i;
      				break;
      			}
      			
      		}
      		
      		if(l == undefined){
      			// Done (optimal solution found)
      			return true;
      		}  	
      		
        	 // l-th row v = (v1,...,vn). Find min_{v_i<0}( r_i/|v_i|)
        	 var j;
        	 var v_i;
        	 var v_i_min;
        	 var theta;
        	 var theta_min;
        	 for(i = 0; i < n_var; i++) {
        	 	v_i = simplexTableau[l+1][1+i];
        	 	if( v_i < 0){
        	 		theta = simplexTableau[0][1+i]/Math.abs(v_i);
        	 		if(theta_min == undefined || theta<theta_min){
        	 			theta_min = theta;
        	 			j = i;
        	 			v_i_min = v_i;
        	 		}
        	 	}
        	 }
        	 if(j == undefined){
        	 	return false; // cost unbounded
        	 }
        	 
        	 // Add mutiple of lth row to all other rows and scale lth row, s.t. 
        	 // (j+1)th column of simplex-tableau u -> e_j
        	 var factor;
        	 for (i = 0 ; i < n_constr + 1; i++){
        	 	if ( i != l + 1){
        	 		factor = simplexTableau[i][1 + j]/v_i_min;
        	 		for ( k = 0; k < n_var+1; k++) {
        	 		 	simplexTableau[i][k] -= factor*simplexTableau[l+1][k]; 
        	 		}
        	 	}
        	 }
        	 // Scale lth row:
        	 for ( k = 0; k < n_var+1; k++) {
        	 	simplexTableau[l+1][k] /= v_i_min;
        	 }
        	 // Update basis indices with l and j:
        	 i_B[l] = j;
        	 
        	 
        };
        
        // Utility functions:
        $.fn.CreateArrayOfZeros = function(length) {
        	var a = [];
        	for(i=0;i<length;i++){
        		a[i] = 0;
        	}
        	return a;
        };
        

    }); // End document ready
    
})(this.jQuery);